import { Hono } from "hono";
import { generateCaptchaChallenge, verifyCaptchaChallenge } from "@/server/captcha";

const captchaRouter = new Hono();

captchaRouter.get("/challenge", (c) => {
  const challenge = generateCaptchaChallenge();
  return c.json({ success: true, challenge });
});

captchaRouter.post("/verify", async (c) => {
  let body: Record<string, unknown> = {};

  try {
    body = await c.req.json<Record<string, unknown>>();
  } catch {
    return c.json({ success: false, message: "Invalid request payload." }, 400);
  }

  const { nonce, timestamp, signature } = body;

  if (typeof nonce !== "string" || typeof timestamp !== "number" || typeof signature !== "string") {
    return c.json({ success: false, message: "Missing required challenge parameters." }, 400);
  }

  const result = verifyCaptchaChallenge(nonce, timestamp, signature);

  if (!result.valid) {
    return c.json({ success: false, message: result.error ?? "Verification failed." }, 400);
  }

  return c.json({ success: true, token: result.token, message: "Verification successful." });
});

export default captchaRouter;
