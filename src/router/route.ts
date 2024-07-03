import  {signup,findId,login,updateProfile, uploadFile, getOtp, verifyOtp } from "./route.controller";
import Router from "koa-router";

const routerOpts: Router.IRouterOptions = {};
const router = new Router(routerOpts);
router.post("/upload-single-file", uploadFile);
router.post("/get-otp",getOtp);
router.post('/verify-otp',verifyOtp); 
router.get("/:id", findId);

router.post("/signup",signup);

router.post("/login", login);
router.put("/update-profile", updateProfile);
export default router;
