import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { ContactPayload } from "@/types";
import { buildContactText, buildContactHtml } from "./email-template";

let transporterInstance: Transporter | null = null;

const getTransporter = (): Transporter | null => {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host =
    import.meta.env.SMTP_HOST
    ?? (typeof process === "object" ? process.env["SMTP_HOST"] : undefined)
    ?? "";
  const portStr =
    import.meta.env.SMTP_PORT
    ?? (typeof process === "object" ? process.env["SMTP_PORT"] : undefined)
    ?? "587";
  const secureStr =
    import.meta.env.SMTP_SECURE
    ?? (typeof process === "object" ? process.env["SMTP_SECURE"] : undefined)
    ?? "false";
  const user =
    import.meta.env.SMTP_USER
    ?? (typeof process === "object" ? process.env["SMTP_USER"] : undefined)
    ?? "";
  const pass =
    import.meta.env.SMTP_PASS
    ?? (typeof process === "object" ? process.env["SMTP_PASS"] : undefined)
    ?? "";

  if (!host || !user || !pass) {
    console.warn("SMTP credentials are not fully configured. Emails will not be dispatched.");
    return null;
  }

  const port = Number(portStr);
  const secure = secureStr === "true" || port === 465;

  transporterInstance = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  return transporterInstance;
};

export interface SendEmailResult {
  readonly success: boolean;
  readonly message: string;
}

export const sendContactEmail = async (payload: ContactPayload): Promise<SendEmailResult> => {
  const toEmail =
    import.meta.env.CONTACT_TO_EMAIL
    ?? (typeof process === "object" ? process.env["CONTACT_TO_EMAIL"] : undefined)
    ?? "";

  if (!toEmail) {
    console.error("CONTACT_TO_EMAIL is not configured.");
    return {
      success: false,
      message: "Email recipient is not configured. Please try again later.",
    };
  }

  const fromEmail =
    import.meta.env.CONTACT_FROM_EMAIL
    ?? (typeof process === "object" ? process.env["CONTACT_FROM_EMAIL"] : undefined)
    ?? "portfolio@example.com";

  const transporter = getTransporter();

  if (!transporter) {
    console.error("SMTP transporter unavailable. Missing environment configuration.");
    return { success: false, message: "Email service is not configured. Please try again later." };
  }

  try {
    await transporter.sendMail({
      from: `"${payload.fullname}" <${fromEmail}>`,
      to: toEmail,
      replyTo: payload.email,
      subject: `Portfolio Contact: ${payload.fullname}`,
      text: buildContactText(payload),
      html: buildContactHtml(payload),
    });

    return { success: true, message: "Message sent successfully! I'll get back to you soon." };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Nodemailer dispatch error:", errorMsg);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
};
