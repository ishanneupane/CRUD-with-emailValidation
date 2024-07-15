import koa from "koa";
import bodyParser from "koa-bodyparser";
import connection from "./data-source";
import routes from "./router";
import { loadPermissions } from "./middleware/authorization";
const app = new koa();
app.use(bodyParser());
app.use(async (ctx, next) => {
  try {
    ctx.state.db = connection;

    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = error.message;
    ctx.app.emit("error", error, ctx as any);
    console.log(error);
  }
});


// app.use(auth.unless({ path: [/^\/public/, /^\/signup/, /^\/login/,/^\/get-otp/,/^\/verify-otp/] }));

const router = routes;

app.use(router.routes()).use(router.allowedMethods());

app.use(loadPermissions)



export default app;
