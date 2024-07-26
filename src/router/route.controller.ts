import * as Koa from "koa";
import * as Jwt from "jsonwebtoken";

import * as bcrypt from "bcrypt";
import User from "../entity/user";
import { Repository } from "typeorm";
import { otp } from "../lib/otp/otpGenerator";
import {
  userValidationCreateSchema,
  userValidationUpdateSchema,
} from "../schema/validator";
import { multerUploader } from "../lib/multer/multer";
const uploadFile = async (ctx: Koa.Context, next: Koa.Next) => {
  return new Promise<void>((resolve, reject) => {
    multerUploader.upload.single("file")(
      (ctx as any).req,
      (ctx as any).res,
      (err: any) => {
        if (err) {
          reject(err);
          return;
        } else {
          resolve();
          return;
        }
      }
    );
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
      console.log("ctx.request.file", (ctx.req as any).file);
      ctx.status = 400;
      ctx.body = {
        message: "File upload failed",
        error: { message: err.message },
      };
    });
};

const generateToken = (id: number, role: string) => {
  return Jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "5h",
  });
};
const getOtp = async (ctx: Koa.Context) => {
  const { email } = ctx.request.body as { email: string };

  if (!email) {
    ctx.status = 400;
    ctx.body = { message: "Email is required" };
    return;
  }
  const data: Repository<User> = ctx.state.db.getRepository(User);
  const userData = await data.findOne({ where: { email: email } });
  if (!userData) {
    ctx.status = 404;
    ctx.body = { message: "User not found" };
    return;
  }

  const Otp = otp.generateOtp();
  try {
    await otp.sendOtp(email, Otp);

    await data.update(
      { email: email },
      { otp: Otp, otpExpiry: new Date(Date.now() + 5 * 60 * 1000) }
    );
    ctx.body = { message: "OTP sent successfully to email" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
};

const findId = async (ctx: Koa.Context) => {
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
};
const findAll = async (ctx: any): Promise<void> => {
  const userRepository: Repository<User> = ctx.state.db.getRepository(User);

  try {
    // Adding Pagination
    const limitValue = parseInt(ctx.query.limit as string, 10) || 5;
    const skipValue = parseInt(ctx.query.skip as string, 10) || 0;

    // Adding Query Parameter
    const filter = ctx.query.filter
      ? JSON.parse(ctx.query.filter as string)
      : {};

    // Build the query with QueryBuilder
    const queryBuilder = userRepository.createQueryBuilder("user");

    // Apply filters if present
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((key, index) => {
        const value = filter[key];

        // if (typeof value === 'string' && value.endsWith('*')) {
        queryBuilder.andWhere(`user.${key} LIKE :${key}`, {
          [key]: value.replace("*", "%") + "%",
        });
        // } else {
        // queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: value });
        // }
      });
    }
    // Apply pagination
    queryBuilder.take(limitValue).skip(skipValue);

    // Execute the query
    const users = await queryBuilder.getMany();

    ctx.body = { data: users };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = {
      message: "Internal server error",
      error: "Problem finding Data",
    };
  }
};
const signup = async (ctx: Koa.Context) => {
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
};

const login = async (ctx: Koa.Context) => {
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

    if (userData.isValidEmail == false) {
      ctx.status = 400;
      ctx.body = { message: "Please verify your email first" };
      return;
    }
    if (isMatch) {
      const token = generateToken(userData.id, userData.role);
      ctx.body = { message: "User logged in", token };
    } else {
      ctx.status = 401;
      ctx.body = { message: "Wrong password " };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
};
const updateProfile = async (ctx: Koa.Context) => {
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
};
export { signup, login, findId, updateProfile, uploadFile, getOtp, findAll };
