import { Repository } from "typeorm";
import User from "../../entity/user";
import Koa from "koa";
const verifyOtp = async (ctx: Koa.Context) => {
  const { email, otp } = ctx.request.body as { email: string; otp: number };

  if (!email || !otp) {
    ctx.status = 400;
    ctx.body = { message: "Email and OTP are required" };
    return;
  }

  const data: Repository<User> = ctx.state.db.getRepository(User);
  const userData = await data.findOne({ where: { email: email } });
  if (otp == userData.otp) {
    await data.update(
      { email: email },
      { isValidEmail: true, otp: null, otpExpiry: null }
    );

    ctx.body = { message: "OTP verified successfully" };
  } else {
    ctx.status = 400;
    ctx.body = { message: "Invalid OTP" };
  }
};

export default verifyOtp;
