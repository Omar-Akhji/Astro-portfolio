import crypto from "node:crypto";

const RUNTIME_SECRET =
  (typeof process === "object" ? process.env["CAPTCHA_SECRET"] : undefined)
  || crypto.randomBytes(32).toString("hex");

const consumedNonces = new Map<string, number>();
const consumedTokens = new Map<string, number>();

// Clean up expired items periodically (every 10 minutes)
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const MAX_TTL_MS = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [nonce, time] of consumedNonces.entries()) {
    if (now - time > MAX_TTL_MS) {
      consumedNonces.delete(nonce);
    }
  }
  for (const [token, time] of consumedTokens.entries()) {
    if (now - time > MAX_TTL_MS) {
      consumedTokens.delete(token);
    }
  }
}, CLEANUP_INTERVAL_MS).unref?.();

const signPayload = (payload: string): string => {
  return crypto.createHmac("sha256", RUNTIME_SECRET).update(payload).digest("hex");
};

const safeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

export interface CaptchaChallenge {
  readonly nonce: string;
  readonly timestamp: number;
  readonly signature: string;
}

export interface VerificationResult {
  readonly valid: boolean;
  readonly error?: string;
  readonly token?: string;
}

/** Generate a new challenge for the client verification widget. */
export const generateCaptchaChallenge = (): CaptchaChallenge => {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const signature = signPayload(`${nonce}:${timestamp}`);

  return { nonce, timestamp, signature };
};

/** Verify a completed client challenge and issue a submission token. */
export const verifyCaptchaChallenge = (
  nonce: string,
  timestamp: number,
  signature: string,
): VerificationResult => {
  if (
    !nonce
    || typeof nonce !== "string"
    || !timestamp
    || typeof timestamp !== "number"
    || !signature
  ) {
    return { valid: false, error: "Invalid challenge parameters provided." };
  }

  const expectedSig = signPayload(`${nonce}:${timestamp}`);
  if (!safeCompare(expectedSig, signature)) {
    return { valid: false, error: "Challenge signature verification failed." };
  }

  const now = Date.now();
  const elapsed = now - timestamp;

  // Bot speed check: humans need at least 400ms
  if (elapsed < 400) {
    return { valid: false, error: "Interaction completed too quickly." };
  }

  // 10 minutes max challenge window
  if (elapsed > 10 * 60 * 1000) {
    return { valid: false, error: "Challenge expired. Please try again." };
  }

  if (consumedNonces.has(nonce)) {
    return { valid: false, error: "Challenge has already been consumed." };
  }

  consumedNonces.set(nonce, now);

  // Issue one-time submission token
  const payloadData = JSON.stringify({ nonce, issuedAt: now });
  const b64Data = Buffer.from(payloadData).toString("base64url");
  const tokenSig = signPayload(b64Data);
  const token = `${b64Data}.${tokenSig}`;

  return { valid: true, token };
};

/** Verify the captcha token passed during form submission. */
export const verifySubmissionCaptcha = (
  token: unknown,
  honeypotValue?: unknown,
): { readonly valid: boolean; readonly error?: string } => {
  // Check honeypot field
  if (typeof honeypotValue === "string" && honeypotValue.trim().length > 0) {
    return { valid: false, error: "Spam activity detected." };
  }

  if (typeof token !== "string" || !token.trim()) {
    return { valid: false, error: "Please complete the human verification check." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Malformed verification token." };
  }

  const [b64Data, sig] = parts;
  if (!b64Data || !sig) {
    return { valid: false, error: "Invalid verification token structure." };
  }

  const expectedSig = signPayload(b64Data);
  if (!safeCompare(expectedSig, sig)) {
    return { valid: false, error: "Invalid verification signature." };
  }

  if (consumedTokens.has(token)) {
    return { valid: false, error: "Verification token has already been used." };
  }

  try {
    const raw = Buffer.from(b64Data, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw) as { nonce?: string; issuedAt?: number };

    if (!parsed.issuedAt || typeof parsed.issuedAt !== "number") {
      return { valid: false, error: "Invalid token payload." };
    }

    const now = Date.now();
    // Valid for 15 minutes from issuance
    if (now - parsed.issuedAt > 15 * 60 * 1000) {
      return { valid: false, error: "Verification expired. Please verify again." };
    }

    consumedTokens.set(token, now);
    return { valid: true };
  } catch {
    return { valid: false, error: "Corrupted verification token." };
  }
};
