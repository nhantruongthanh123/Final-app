import nodemailer from "nodemailer";
import { Resend } from "resend";
import { AppError } from "./app.error.js";

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verifyLink: string,
) {
  try {
    if (process.env.NODE_ENV === "production") {
      const resend = new Resend(process.env.RESEND_API_KEY as string);

      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "thanhnhanqs2005@gmail.com",
        subject: `The user ${firstName} requested a verified email`,
        html: `<p> The user with email ${email} requested a verified email.</p> Please click the following link to verify user's email: <a href="${verifyLink}">${verifyLink}</a>`,
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: '"Fotobook Local" <no-reply@localhost.test>',
        to: email,
        subject: "Verify your Fotobook email",
        html: `<p>Hi ${firstName},</p>
               <p>Please click the link below to verify your email address:</p>
               <p><a href="${verifyLink}">${verifyLink}</a></p>
               <p>If you did not request this, please ignore this email.</p>`,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("📬 View test email at:", previewUrl);
      }
    }
  } catch (error) {
    console.error("Nodemailer Real Error:", error);
    throw new AppError("Failed to send verification email", 500);
  }
}
