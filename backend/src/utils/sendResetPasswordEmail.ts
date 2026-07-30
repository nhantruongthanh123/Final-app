import nodemailer from "nodemailer";
import { Resend } from "resend";
import { AppError } from "./app.error.js";

export async function sendResetPasswordEmail(
  email: string,
  firstName: string,
  resetLink: string,
) {
  try {
    if (process.env.NODE_ENV === "production") {
      const resend = new Resend(process.env.RESEND_API_KEY as string);

      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "thanhnhanqs2005@gmail.com",
        subject: `The user ${firstName} requested a password reset`,
        html: `<p> The user with email ${email} requested a password reset.</p> Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
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
        subject: "Reset Fotobook password request",
        html: `<p>Hi ${firstName},</p>
               <p>You requested a password reset. Please click the link below to reset your password (valid for 15 minutes):</p>
               <p><a href="${resetLink}">${resetLink}</a></p>
               <p>If you did not request this, please ignore this email.</p>`,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("📬 View test email at:", previewUrl);
      }
    }
  } catch (error) {
    console.error("Nodemailer Real Error:", error);
    throw new AppError("Failed to send reset password email", 500);
  }
}
