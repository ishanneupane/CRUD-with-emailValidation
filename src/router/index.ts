import { auth } from "../middleware/authentication";
import { checkPermissions } from "../middleware/permissionManager";
import {
  signup,
  findId,
  login,
  updateProfile,
  uploadFile,
  getOtp,
  verifyOtp,
} from "./route.controller";
import Router from "koa-router";

const routerOpts: Router.IRouterOptions = {};
const router = new Router(routerOpts);
router.post(
  "/upload-single-file",
  auth,
  checkPermissions("createAny", "user"),
  uploadFile
);
router.post("/get-otp", getOtp);
router.post("/verify-otp", verifyOtp);
router.get("/:id", auth, checkPermissions("readAny", "user"), findId);

router.post("/signup", signup);

router.post("/login", login);
router.put(
  "/update-profile",
  auth,
  checkPermissions("updateOwn", "user"),
  updateProfile
);

export default router;
