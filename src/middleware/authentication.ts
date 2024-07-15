import jwt from "koa-jwt";

export const auth = jwt({ secret: process.env.JWT_SECRET });
