import { Hono } from "hono";
import { z } from "zod";
import type { ContactFieldErrors, ContactFormState, ContactPayload } from "@/types";
import { sendContactEmail } from "@/server/mailer";

export const ContactSchema = z.object({
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
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        message: formData.get("message"),
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
    let fullnameError: string | undefined;
    let emailError: string | undefined;
    let messageError: string | undefined;

    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "fullname" && !fullnameError) {
        fullnameError = issue.message;
      } else if (field === "email" && !emailError) {
        emailError = issue.message;
      } else if (field === "message" && !messageError) {
        messageError = issue.message;
      }
    }

    const fieldErrors: ContactFieldErrors = {
      ...(fullnameError && { fullname: fullnameError }),
      ...(emailError && { email: emailError }),
      ...(messageError && { message: messageError }),
    };

    const errorResponse: ContactFormState = {
      success: false,
      message: "Please fix the errors below.",
      errors: fieldErrors,
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
