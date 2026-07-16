import { getTransporter } from "#config/mailer.js";
import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(
  email: string,
  firstName: string,
  resetLink: string,
) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Fotobook" <no-reply@fotobook.test>',
    to: email,
    subject: "Reset Fotobook password request ",
    text: `Hi ${firstName},\n\nYou have requested to reset your Fotobook password. Please click the link below to reset your password (link valid for 15 minutes):\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("📬 Xem email test tại:", previewUrl);
  }
}
