import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import captchaRouter from "@/server/routes/captcha";
import contactRouter from "@/server/routes/contact";
import type { ContactFormState } from "@/types";

const app = new Hono().basePath("/api");

// Global middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check endpoint
app.get("/health", (c) => c.json({ success: true, status: "ok" }));

// Route registration
app.route("/contact", contactRouter);
app.route("/captcha", captchaRouter);

// Centralized error handling
app.onError((err, c) => {
  console.error("Hono server error:", err);
  const errorResponse: ContactFormState = {
    success: false,
    message: "Internal server error. Please try again later.",
  };
  return c.json(errorResponse, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, message: "API endpoint not found." }, 404);
});

export default app;
export type AppType = typeof app;
