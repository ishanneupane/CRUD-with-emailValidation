"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const route_controller_1 = __importDefault(require("./route.controller"));
const datasource_1 = __importDefault(require("./datasource"));
const route_controller_2 = __importDefault(require("./route.controller"));
const app = new koa_1.default();
app.use(koa_bodyparser_1.default());
app.use(async (ctx, next) => {
    try {
        ctx.state.db = datasource_1.default;
        await next();
    }
    catch (error) {
        ctx.status = error.status || 500;
        ctx.body = error.message;
        ctx.app.emit("error", error, ctx);
        console.log(error);
    }
});
exports.auth = koa_jwt_1.default({ secret: process.env.JWT_SECRET });
app.use(exports.auth.unless({ path: [/^\/public/, /^\/signup/, /^\/login/] }));
const router = route_controller_2.default;
app.use(router.routes()).use(router.allowedMethods());
app.use(route_controller_1.default.routes());
app.use(route_controller_1.default.allowedMethods());
exports.default = app;
