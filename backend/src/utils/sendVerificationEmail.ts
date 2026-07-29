import { getTransporter } from "#/config/mailer.js";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verifyLink: string,
) {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: '"Fotobook" <thanhnhanqs2005@gmail.com>',
      to: email,
      subject: "Verify your Fotobook account",
      text: `Hello ${firstName},\n\nThank you for registering with Fotobook. Please click the link below to verify your email (valid for 24 hours):\n\n${verifyLink}\n\nIf you did not create this account, please ignore this email.`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log("📬 View test email at:", previewUrl);
  } catch (error) {
    throw new Error("Failed to send verification email");
  }
}
