import dotenv from "dotenv";
import dns from "node:dns";
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

let cachedTransporter: Transporter | null = null;
type MailerOptions = SMTPTransport.Options & { family?: number };

export async function getTransporter(): Promise<Transporter> {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.NODE_ENV === "production") {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      family: 4,
    } as MailerOptions);
  } else {
    const testAccount = await nodemailer.createTestAccount();

    cachedTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("📧 Ethereal test account:", testAccount.user);
  }

  return cachedTransporter;
}
