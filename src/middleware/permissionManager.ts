import { ac } from "./authorization";
import { Context, Next } from "koa"; 

export const checkPermissions = (action: string, resource: string) => {
  return async (ctx: Context, next: Next) => {
    try {
      const userRole = ctx.state.user.role;
      console.log("ac", (ac as any).can(userRole));
      const permission = (ac as any).can(userRole)[action](resource);
      console.log("ac", ac);

      console.log(permission);

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
