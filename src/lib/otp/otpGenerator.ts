import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();
const userId = process.env.MAILER_USER;
const password = process.env.MAILER_PASSWORD;
const generateOtp = function generateOtp() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

let transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: userId,
    pass: password,
  },
});
const sendOtp = async function sendOtp(email: string, otp: string) {
  let mailOptions = {
    from: userId, // Sender's email address
    to: email,
    subject: "Your OTP for verification",
    text: `Your OTP is: ${otp}`,
  };

  try {
    let info = await transport.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export const otp = { generateOtp, sendOtp };
