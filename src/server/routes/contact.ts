import { Hono } from "hono";
import { z } from "zod";
import type { ContactFieldErrors, ContactFormState, ContactPayload } from "@/types";
import { verifySubmissionCaptcha } from "@/server/captcha";
import { sendContactEmail } from "@/server/mailer";

export const ContactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z.email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  captchaToken: z.string().min(1, "Please complete the human verification check"),
});

const contactRouter = new Hono();

contactRouter.post("/", async (c) => {
  let rawBody: Record<string, unknown> = {};

  const contentType = c.req.header("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      rawBody = await c.req.json<Record<string, unknown>>();
    } catch {
      const errorState: ContactFormState = {
        success: false,
        message: "Invalid JSON payload provided.",
      };
      return c.json(errorState, 400);
    }
  } else {
    try {
      const formData = await c.req.formData();
      rawBody = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        message: formData.get("message"),
        captchaToken: formData.get("captchaToken"),
        _gotcha_hp: formData.get("_gotcha_hp"),
      };
    } catch {
      const errorState: ContactFormState = {
        success: false,
        message: "Unable to parse submitted form data.",
      };
      return c.json(errorState, 400);
    }
  }

  const result = ContactSchema.safeParse(rawBody);

  if (!result.success) {
    let fullNameError: string | undefined;
    let emailError: string | undefined;
    let messageError: string | undefined;
    let captchaError: string | undefined;

    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "fullName" && !fullNameError) {
        fullNameError = issue.message;
      } else if (field === "email" && !emailError) {
        emailError = issue.message;
      } else if (field === "message" && !messageError) {
        messageError = issue.message;
      } else if (field === "captchaToken" && !captchaError) {
        captchaError = issue.message;
      }
    }

    const fieldErrors: ContactFieldErrors = {
      ...(fullNameError && { fullName: fullNameError }),
      ...(emailError && { email: emailError }),
      ...(messageError && { message: messageError }),
      ...(captchaError && { captcha: captchaError }),
    };

    const errorResponse: ContactFormState = {
      success: false,
      message: "Please fix the errors below.",
      errors: fieldErrors,
    };

    return c.json(errorResponse, 400);
  }

  // Verify CAPTCHA cryptographic token & honeypot
  const captchaCheck = verifySubmissionCaptcha(result.data.captchaToken, rawBody["_gotcha_hp"]);
  if (!captchaCheck.valid) {
    const errorResponse: ContactFormState = {
      success: false,
      message: captchaCheck.error ?? "Human verification failed. Please try again.",
      errors: { captcha: captchaCheck.error ?? "Verification failed." },
    };
    return c.json(errorResponse, 400);
  }

  const payload: ContactPayload = result.data;
  const dispatchResult = await sendContactEmail(payload);

  if (!dispatchResult.success) {
    const errorState: ContactFormState = { success: false, message: dispatchResult.message };
    return c.json(errorState, 500);
  }

  const successState: ContactFormState = { success: true, message: dispatchResult.message };
  return c.json(successState, 200);
});

export default contactRouter;
