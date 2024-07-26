import { ac } from "./authorization";
import { Context, Next } from "koa";

export const checkPermissions = (action: string, resource: string) => {
  return async (ctx: Context, next: Next) => {
    try {
      const userRole = ctx.state.user.role;
      const permission = (ac as any).can(userRole)[action](resource);

      if (permission.granted) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = { message: "Forbidden" };
      }
    } catch (error) {
      console.error("Permission check error:", error);
    }
  };
};
