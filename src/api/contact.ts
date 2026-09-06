import type { APIRoute } from "astro";
import { z } from "zod";

const ContactSchema = z.object({
  fullname: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z.email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

export const ALL: APIRoute = () => {
  return Response.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const raw = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    const result = ContactSchema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      }
      return Response.json(
        { success: false, message: "Please fix the errors below.", errors: fieldErrors },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { fullname, email, message } = result.data;

    const resendApiKey =
      (import.meta.env["RESEND_API_KEY"] as string | undefined)
      ?? process.env["RESEND_API_KEY"]
      ?? "";

    if (resendApiKey === "") {
      console.error("RESEND_API_KEY environment variable is not configured.");
      return Response.json(
        { success: false, message: "Email service is not configured. Please try again later." },
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const contactTo: string =
      (import.meta.env["CONTACT_TO_EMAIL"] as string | undefined)
      ?? process.env["CONTACT_TO_EMAIL"]
      ?? "";

    if (contactTo === "") {
      console.error("CONTACT_TO_EMAIL environment variable is not configured.");
      return Response.json(
        { success: false, message: "Email service is not configured. Please try again later." },
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const fromEmail: string =
      (import.meta.env["RESEND_FROM_EMAIL"] as string | undefined)
      ?? process.env["RESEND_FROM_EMAIL"]
      ?? "onboarding@resend.dev";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${fullname} <${fromEmail}>`,
        to: [contactTo],
        reply_to: email,
        subject: `Portfolio Contact: ${fullname}`,
        text: `Name: ${fullname}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 8px;">${fullname}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <div style="padding: 16px; background: #f9f9f9; border-radius: 8px;">
              <p style="white-space: pre-wrap; color: #333; line-height: 1.6;">${message}</p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend API error:", response.status, errorBody);
      return Response.json(
        { success: false, message: "Failed to send message. Please try again later." },
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return Response.json(
      { success: true, message: "Message sent successfully! I'll get back to you soon." },
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return Response.json(
      { success: false, message: "Failed to send message. Please try again later." },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
