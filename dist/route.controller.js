"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const Jwt = __importStar(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const bcrypt = __importStar(require("bcrypt"));
const user_1 = __importDefault(require("./entity/user"));
const path_1 = __importDefault(require("path"));
const validator_1 = require("./schema/validator");
const routerOpts = {};
const router = new koa_router_1.default(routerOpts);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const originalName = encodeURIComponent(path_1.default.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, "");
        const timestamp = Date.now();
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, originalName + timestamp + extension);
    },
});
const upload = multer_1.default({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 4 },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("Please upload an image with extension jpg, jpeg or png"));
        }
        callback(null, true);
    },
});
const generateToken = (id) => {
    return Jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
    });
};
router.post("/upload-single-file", (ctx, next) => {
    return new Promise((resolve, reject) => {
        upload.single("file")(ctx.req, ctx.res, (err) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve();
                return;
            }
        });
    })
        .then(() => {
        console.log("ctx.request.file", ctx.req.file);
        ctx.status = 200;
        const fileData = ctx.req.file.originalname;
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
router.get("/", async (ctx) => {
    const data = ctx.state.db.getRepository(user_1.default);
    const userData = await data.find();
    ctx.body = { data: userData };
});
router.get("/:id", async (ctx) => {
    const data = ctx.state.db.getRepository(user_1.default);
    const userData = await data.findOne({
        where: { id: ctx.params.id },
    });
    if (!userData) {
        ctx.status = 404;
        ctx.body = { message: "User not found" };
        return;
    }
    ctx.body = { data: userData };
});
router.post("/signup", async (ctx) => {
    try {
        const data = ctx.state.db.getRepository(user_1.default);
        await validator_1.userValidationCreateSchema.validate(ctx.request.body);
        const { name, email, password } = ctx.request.body;
        const hash = await bcrypt.hash(password, 10);
        await data.save({ name, email, password: hash });
        ctx.body = { message: "User created", data: ctx.request.body };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { message: "Internal server error", error: error.message };
    }
});
router.post("/login", async (ctx) => {
    try {
        await validator_1.userValidationCreateSchema.validate(ctx.request.body);
        const { email, password } = ctx.request.body;
        const data = ctx.state.db.getRepository(user_1.default);
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
        }
        else {
            ctx.status = 401;
            ctx.body = { message: "Wrong password" };
        }
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { message: "Internal server error", error: error.message };
    }
});
router.put("/profile", async (ctx) => {
    try {
        await validator_1.userValidationUpdateSchema.validate(ctx.request.body);
        const userId = ctx.state.user.id;
        const data = ctx.state.db.getRepository(user_1.default);
        const userData = await data.findOne({ where: { id: userId } });
        if (!userData) {
            ctx.status = 404;
            ctx.body = { message: "User not found" };
            return;
        }
        const _a = ctx.request.body, { password } = _a, otherUpdates = __rest(_a, ["password"]);
        let updatedData = Object.assign({}, otherUpdates);
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            updatedData.password = hash;
        }
        await data.update({ id: userId }, updatedData);
        ctx.body = { message: "UserData updated" };
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = { message: "Internal server error", error: err.message };
    }
});
exports.default = router;
