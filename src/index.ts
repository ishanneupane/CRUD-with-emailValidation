import koa from "koa";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";
import connection from "./datasource";
import routes from "./router/route";
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

export const auth = jwt({ secret: process.env.JWT_SECRET });

app.use(auth.unless({ path: [/^\/public/, /^\/signup/, /^\/login/,/^\/get-otp/,/^\/verify-otp/] }));

const router = routes;

app.use(router.routes()).use(router.allowedMethods());


export default app;
