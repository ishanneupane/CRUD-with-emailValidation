import { auth } from "../middleware/authentication";
import { checkPermissions } from "../middleware/permissionManager";
import {
  signup,
  findId,
  login,
  updateProfile,
  uploadFile,
  getOtp,
  findAll,
} from "./route.controller";
import verifyOtp from "../lib/otp/otpVerifier";
import Router from "koa-router";

const routerOpts: Router.IRouterOptions = {};
const router = new Router(routerOpts);

router.post("/signup", signup);
router.post("/login", login);
router.post("/get-otp", getOtp);
router.post("/verify-otp",verifyOtp);
router.post("/upload-single-file", auth, uploadFile);
router.get("/:id", auth, checkPermissions("readAny", "user"), findId);
router.get("/",findAll );
router.put(
  "/update-profile",
  auth,
  checkPermissions("updateOwn", "user"),
  updateProfile
);

export default router;
