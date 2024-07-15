
import { accessControl } from "./authorization";

 export const checkPermissions = (action:string, resource:string) => {
    return async (ctx :any , next:any) => {
      console.log(ctx.state.user)
      const userRole = ctx.state.user.role; 
      const permission = (accessControl as any).can(userRole)[action] (resource);
  console.log(permission)
      if (permission.granted) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = { message: "Forbidden" };
      }
    };
  };