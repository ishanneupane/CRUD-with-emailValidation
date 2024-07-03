import * as Koa from "koa";
import Router from "koa-router";
import * as Jwt from "jsonwebtoken";
import multer from "multer";
import * as bcrypt from "bcrypt";
import User from "../entity/user";
import path from "path";
import { Repository } from "typeorm";
import { generateOtp, sendOtp } from "../auth/otp";
import {
  userValidationCreateSchema,
  userValidationUpdateSchema,
} from "../schema/validator";
const routerOpts: Router.IRouterOptions = {};
const router = new Router(routerOpts);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    const originalName = encodeURIComponent(
      path.parse(file.originalname).name
    ).replace(/[^a-zA-Z0-9]/g, "");
    const timestamp = Date.now();

    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, originalName + timestamp + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(
        new Error("Please upload an image with extension jpg, jpeg or png")
      );
    }
    callback(null, true);
  },
});

const generateToken = (id: number) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "5h",
  });
};

router.post("/upload-single-file", (ctx: Koa.Context, next: Koa.Next) => {
  return new Promise<void>((resolve, reject) => {
    upload.single("file")((ctx as any).req, (ctx as any).res, (err: any) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
        return;
      }
    });
  })
    .then(() => {
      console.log("ctx.request.file", (ctx.req as any).file);

      ctx.status = 200;
      const fileData = (ctx.req as any).file.originalname;
      ctx.body = {
        message: "File uploaded successfully",

        file: fileData,
      };
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = {
        message: "File upload failed",
        error: { message: err.message },
      };
    });
});
router.post("/get-otp", async (ctx: Koa.Context) => {
  const { email } = ctx.request.body as { email: string };

  if (!email) {
    ctx.status = 400;
    ctx.body = { message: "Email is required" };
    return;
  }
  const data: Repository<User> = ctx.state.db.getRepository(User);
  const userData = await data.findOne({ where: { email:email } });
  if (!userData) {
    ctx.status = 404;
    ctx.body = { message: "User not found" };
    return;
  }


  const otp = generateOtp();
  try {
    await sendOtp(email, otp);
    
  await data.update({ email:email }, { otp: otp, otpExpiry: new Date(Date.now() + 5 * 60 * 1000) });
    ctx.body = { message: "OTP sent successfully to email" };
  } catch (error) {
    console.error("Error sending OTP:", error); // Log the error
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
});
router.post('/verify-otp', async (ctx: Koa.Context) => {
  const { email, otp } = ctx.request.body as { email: string, otp: number };

  if (!email || !otp) {
    ctx.status = 400;
    ctx.body = { message: "Email and OTP are required" };
    return;
  }

  const data: Repository<User> = ctx.state.db.getRepository(User);
  const userData = await data.findOne({ where: { email:email } });
  if (otp==userData.otp) {
  await data.update({ email:email }, { isValidEmail: true,otp: null, otpExpiry: null });
    
    ctx.body = { message: "OTP verified successfully" };
  } else {
    ctx.status = 400;
    ctx.body = { message: "Invalid OTP" }; 
  }


});

router.get("/:id", async (ctx: Koa.Context) => {
  const data: Repository<User> = ctx.state.db.getRepository(User);
  const userData = await data.findOne({
    where: { id: (ctx as any).params.id },
  });
  if (!userData) {
    ctx.status = 404;
    ctx.body = { message: "User not found" };
    return;
  }
  ctx.body = { data: userData };
});

router.post("/signup", async (ctx: Koa.Context) => {
  try {
    const data: Repository<User> = ctx.state.db.getRepository(User);
    await userValidationCreateSchema.validate(ctx.request.body);
    const { name, email, password } = ctx.request.body as {
      name: string;
      email: string;
      password: string;
    };
    const hash = await bcrypt.hash(password, 10);

    await data.save({ name, email, password: hash });
    ctx.body = { message: "User created", data: ctx.request.body };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
});

router.post("/login", async (ctx: Koa.Context) => {
  try {
    await userValidationCreateSchema.validate(ctx.request.body);
    const { email, password } = ctx.request.body as {
      email: string;
      password: string;
    };

    const data: Repository<User> = ctx.state.db.getRepository(User);

    const userData = await data.findOne({
      where: { email: email },
    });

    if (!userData) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }
    const isMatch = await bcrypt.compare(password, userData.password);


    if(userData.isValidEmail==false){
      ctx.status=400;
      ctx.body={message:"Please verify your email first"}
      return;
    }
    if (isMatch ) {
      const token = generateToken(userData.id);
      ctx.body = { message: "User logged in", token };
    } else {
      ctx.status = 401;
      ctx.body = { message: "Wrong password " };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
});
router.put("/profile", async (ctx: Koa.Context) => {
  try {
    await userValidationUpdateSchema.validate(ctx.request.body);
    const userId = ctx.state.user.id;
    const data: Repository<User> = ctx.state.db.getRepository(User);
    const userData = await data.findOne({ where: { id: userId } });

    if (!userData) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }

    const { password, ...otherUpdates } = ctx.request.body as {
      password: string;
    } & { [key: string]: any };
    let updatedData: { [key: string]: any } = { ...otherUpdates };

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updatedData.password = hash;
    }

    await data.update({ id: userId }, updatedData);
    ctx.body = { message: "UserData updated" };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: err.message };
  }
});
export default router;
