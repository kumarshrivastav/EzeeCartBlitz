import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_GMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

async function ResetYourPassword(userEmail) {
  let mailOptions = {
    from: process.env.ADMIN_GMAIL,
    to: userEmail,
    subject: "Change Your Password By Gmail",
    html: `
        <p style="font-family:serif; font-weight:600">You can change your password with this link. <a href="${process.env.URL_NAME}/resetpasswordbygmail/${userEmail}" style="color: blue;">Click here for change your password.</a></p>
        `,
  };
  try {
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export default ResetYourPassword;
