import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { ContactPayload } from "@/types";

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
      text: `Name: ${payload.fullname}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #6346e6; margin-top: 0; font-size: 20px; border-bottom: 2px solid #6346e6; padding-bottom: 12px;">
            New Contact Message
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #555555; width: 80px;">Name:</td>
              <td style="padding: 8px 0; color: #222222;">${payload.fullname}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #555555;">Email:</td>
              <td style="padding: 8px 0; color: #222222;">
                <a href="mailto:${payload.email}" style="color: #6346e6; text-decoration: none;">${payload.email}</a>
              </td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <div style="padding: 16px; background-color: #f7f7fa; border-radius: 8px; border-left: 4px solid #6346e6;">
            <p style="white-space: pre-wrap; color: #333333; line-height: 1.6; margin: 0; font-size: 15px;">
              ${payload.message}
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, message: "Message sent successfully! I'll get back to you soon." };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Nodemailer dispatch error:", errorMsg);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
};
