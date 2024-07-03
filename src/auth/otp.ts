import nodemailer from "nodemailer";


export function generateOtp() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export let transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6d401017890a56",
      pass: "58046d264009bd"
    }
  });
export async function sendOtp(email: string, otp: string) {
    let mailOptions = {
        from:"6d401017890a56", // Sender's email address
        to: email,
        subject: 'Your OTP for verification',
        text: `Your OTP is: ${otp}`
    };

    try {
        let info = await transport.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}
