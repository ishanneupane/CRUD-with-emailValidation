import * as Koa from "koa";
import Router from "koa-router";
import * as Jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import User from "./entity/user";
import { Repository } from "typeorm";
import {
  userValidationCreateSchema,
  userValidationUpdateSchema,
} from "./schema/validator";

const routerOpts: Router.IRouterOptions = {};
const router = new Router(routerOpts);

const generateToken = (id: number) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

router.get("/", async (ctx: Koa.Context) => {
  const data: Repository<User> = ctx.state.db.getRepository(User);
  const userData = await data.find();
  ctx.body = { data: userData };
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

    if (isMatch) {
      const token = generateToken(userData.id);
      ctx.body = { message: "User logged in", token };
    } else {
      ctx.status = 401;
      ctx.body = { message: "Wrong password" };
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
