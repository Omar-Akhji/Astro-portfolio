import type { ContactFormState } from "../types";

const isContactFormState = (value: unknown): value is ContactFormState => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "success" in value
    && typeof value.success === "boolean"
    && "message" in value
    && typeof value.message === "string"
  );
};

export const setupContactPage = (): void => {
  // ── Map Loading Logic ──
  const loadMapBtn = document.querySelector<HTMLButtonElement>("#load-map-btn");
  const mapWrapper = document.querySelector<HTMLDivElement>("#map-frame-wrapper");

  if (loadMapBtn && mapWrapper) {
    loadMapBtn.addEventListener("click", (): void => {
      loadMapBtn.classList.add("hidden");
      mapWrapper.classList.remove("hidden");

      const iframe = document.createElement("iframe");
      iframe.src =
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105884.81432412854!2d-6.911831826075939!3d33.96919056678258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871af50c5f%3A0xb003097fa3670ee9!2sRabat!5e0!3m2!1sen!2sma!4v1710000000000!5m2!1sen!2sma";
      iframe.title = "Google Maps location of Rabat, Morocco";
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "0";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.className = "grayscale invert w-full h-full";

      mapWrapper.append(iframe);
    });
  }

  // ── Form Submission Logic ──
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  const banner = document.querySelector<HTMLDivElement>("#contact-status-banner");
  const bannerSuccessIcon = document.querySelector<SVGElement>("#banner-icon-success");
  const bannerErrorIcon = document.querySelector<SVGElement>("#banner-icon-error");
  const bannerMessage = document.querySelector<HTMLParagraphElement>("#banner-message");
  const submitBtn = document.querySelector<HTMLButtonElement>("#submit-btn");
  const submitSpinner = document.querySelector<SVGElement>("#submit-spinner");
  const submitIcon = document.querySelector<SVGElement>("#submit-icon");
  const submitLabel = document.querySelector<HTMLSpanElement>("#submit-label");

  const fullnameInput = document.querySelector<HTMLInputElement>("#fullname");
  const emailInput = document.querySelector<HTMLInputElement>("#email");
  const messageInput = document.querySelector<HTMLTextAreaElement>("#message");

  const fullnameError = document.querySelector<HTMLParagraphElement>("#fullname-error");
  const emailError = document.querySelector<HTMLParagraphElement>("#email-error");
  const messageError = document.querySelector<HTMLParagraphElement>("#message-error");

  // ── Captcha Elements ──
  const captchaWidget = document.querySelector<HTMLDivElement>("#captcha-widget");
  const captchaBtn = document.querySelector<HTMLButtonElement>("#captcha-btn");
  const captchaIdleIcon = document.querySelector<HTMLSpanElement>("#captcha-idle-icon");
  const captchaSpinner = document.querySelector<SVGElement>("#captcha-spinner");
  const captchaCheckIcon = document.querySelector<SVGElement>("#captcha-check-icon");
  const captchaTitle = document.querySelector<HTMLSpanElement>("#captcha-title");
  const captchaSubtext = document.querySelector<HTMLSpanElement>("#captcha-subtext");
  const captchaTokenInput = document.querySelector<HTMLInputElement>("#captcha-token");
  const captchaError = document.querySelector<HTMLParagraphElement>("#captcha-error");
  const captchaGlow = document.querySelector<HTMLDivElement>("#captcha-glow");

  if (
    !form
    || !banner
    || !bannerSuccessIcon
    || !bannerErrorIcon
    || !bannerMessage
    || !submitBtn
    || !submitSpinner
    || !submitIcon
    || !submitLabel
    || !fullnameInput
    || !emailInput
    || !messageInput
    || !fullnameError
    || !emailError
    || !messageError
    || !captchaWidget
    || !captchaBtn
    || !captchaIdleIcon
    || !captchaSpinner
    || !captchaCheckIcon
    || !captchaTitle
    || !captchaSubtext
    || !captchaTokenInput
    || !captchaError
  ) {
    return;
  }

  // ── Captcha State & Logic ──
  interface ChallengeData {
    readonly nonce: string;
    readonly timestamp: number;
    readonly signature: string;
  }

  let currentChallenge: ChallengeData | null = null;
  let isVerifying = false;
  let isVerified = false;

  const showCaptchaError = (msg: string): void => {
    captchaError.textContent = msg;
    captchaError.classList.remove("hidden");
    captchaWidget.classList.add("border-red-500/50");
  };

  const clearCaptchaError = (): void => {
    captchaError.textContent = "";
    captchaError.classList.add("hidden");
    captchaWidget.classList.remove("border-red-500/50");
  };

  const fetchChallenge = async (): Promise<void> => {
    try {
      const res = await fetch("/api/captcha/challenge");
      if (!res.ok) {
        return;
      }
      const data = (await res.json()) as { success: boolean; challenge?: ChallengeData };
      if (data.success && data.challenge) {
        currentChallenge = data.challenge;
      }
    } catch (err: unknown) {
      console.warn("Failed to initialize security challenge:", err);
    }
  };

  const resetCaptcha = (refetch = true): void => {
    isVerifying = false;
    isVerified = false;
    captchaTokenInput.value = "";

    captchaBtn.setAttribute("aria-checked", "false");
    captchaBtn.className =
      "group relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-blueviolet/60 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-blueviolet hover:bg-blueviolet/15 hover:shadow-[0_0_15px_rgba(99,70,230,0.35)] focus:border-blueviolet focus:ring-2 focus:ring-blueviolet/40 focus:outline-none";

    captchaIdleIcon.classList.remove("hidden");
    captchaSpinner.classList.add("hidden");
    captchaCheckIcon.classList.add("hidden");

    captchaWidget.classList.remove("border-green-500/40", "border-red-500/50");
    if (captchaGlow) {
      captchaGlow.className =
        "pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-blueviolet/10 blur-2xl transition-all duration-500 opacity-40";
    }

    captchaTitle.textContent = "Verify you are human";
    captchaTitle.className =
      "text-sm font-medium text-text select-none transition-colors duration-200";

    captchaSubtext.textContent = "Click the checkbox to verify";
    captchaSubtext.className =
      "text-xs text-text-muted/70 select-none transition-colors duration-200";

    clearCaptchaError();

    if (refetch) {
      void fetchChallenge();
    }
  };

  const handleVerify = async (): Promise<void> => {
    if (isVerifying || isVerified) {
      return;
    }

    if (!currentChallenge) {
      await fetchChallenge();
      if (!currentChallenge) {
        showCaptchaError("Unable to initialize security challenge. Please try again.");
        return;
      }
    }

    isVerifying = true;
    clearCaptchaError();

    // Verifying UI state
    captchaIdleIcon.classList.add("hidden");
    captchaSpinner.classList.remove("hidden");
    captchaTitle.textContent = "Verifying browser integrity...";
    captchaTitle.className = "text-sm font-medium text-blueviolet animate-pulse select-none";
    captchaSubtext.textContent = "Validating security handshake...";

    const startTime = Date.now();
    const MIN_ELAPSED = 600;

    try {
      const response = await fetch("/api/captcha/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentChallenge),
      });

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_ELAPSED) {
        await new Promise((resolve) => setTimeout(resolve, MIN_ELAPSED - elapsed));
      }

      const data = (await response.json()) as {
        success: boolean;
        token?: string;
        message?: string;
      };

      if (response.ok && data.success && data.token) {
        isVerified = true;
        captchaTokenInput.value = data.token;

        // Verified UI state
        captchaBtn.setAttribute("aria-checked", "true");
        captchaBtn.className =
          "group relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-300 focus:outline-none";

        captchaSpinner.classList.add("hidden");
        captchaCheckIcon.classList.remove("hidden");

        captchaWidget.classList.add("border-green-500/40");
        if (captchaGlow) {
          captchaGlow.className =
            "pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-green-500/10 blur-2xl transition-all duration-500 opacity-60";
        }

        captchaTitle.textContent = "Verification successful";
        captchaTitle.className = "text-sm font-semibold text-green-400 select-none";
        captchaSubtext.textContent = "Human identity confirmed";
        captchaSubtext.className = "text-xs text-green-400/80 select-none";
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (err: unknown) {
      console.error("Captcha verification error:", err);
      resetCaptcha(false);
      showCaptchaError("Verification failed. Click to try again.");
      void fetchChallenge();
    } finally {
      isVerifying = false;
    }
  };

  captchaBtn.addEventListener("click", (): void => {
    void handleVerify();
  });

  captchaBtn.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      void handleVerify();
    }
  });

  // Pre-fetch challenge
  void fetchChallenge();

  const setPending = (pending: boolean): void => {
    submitBtn.disabled = pending;
    fullnameInput.disabled = pending;
    emailInput.disabled = pending;
    messageInput.disabled = pending;
    if (captchaBtn) {
      captchaBtn.disabled = pending;
    }

    if (pending) {
      submitSpinner.classList.remove("hidden");
      submitLabel.textContent = "Sending...";
    } else {
      submitSpinner.classList.add("hidden");
      submitLabel.textContent = "Send Message";
    }
  };

  const clearFieldErrors = (): void => {
    fullnameError.textContent = "";
    fullnameError.classList.add("hidden");
    fullnameInput.classList.remove("border-red-500/50!");

    emailError.textContent = "";
    emailError.classList.add("hidden");
    emailInput.classList.remove("border-red-500/50!");

    messageError.textContent = "";
    messageError.classList.add("hidden");
    messageInput.classList.remove("border-red-500/50!");

    clearCaptchaError();
  };

  const hideBanner = (): void => {
    banner.classList.add("hidden");
    banner.className = "hidden mbe-6 flex items-center gap-3 rounded-xl border-2 p-4";
    bannerSuccessIcon.classList.add("hidden");
    bannerErrorIcon.classList.add("hidden");
    bannerMessage.textContent = "";
  };

  const showBanner = (success: boolean, message: string): void => {
    banner.classList.remove("hidden");
    if (success) {
      banner.className =
        "mbe-6 flex items-center gap-3 rounded-xl border-2 p-4 border-green-500/30 bg-green-500/10 text-green-400";
      bannerSuccessIcon.classList.remove("hidden");
      bannerErrorIcon.classList.add("hidden");
    } else {
      banner.className =
        "mbe-6 flex items-center gap-3 rounded-xl border-2 p-4 border-red-500/30 bg-red-500/10 text-red-400";
      bannerSuccessIcon.classList.add("hidden");
      bannerErrorIcon.classList.remove("hidden");
    }
    bannerMessage.textContent = message;
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();
    clearFieldErrors();
    hideBanner();

    // Check if human verification completed
    if (!isVerified || !captchaTokenInput.value) {
      showCaptchaError("Please complete the human verification check before sending.");
      captchaBtn.focus();
      return;
    }

    setPending(true);

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });

      const rawData: unknown = await response.json();

      if (isContactFormState(rawData)) {
        if (response.ok && rawData.success) {
          showBanner(true, rawData.message);
          form.reset();
          resetCaptcha(true);
        } else {
          showBanner(false, rawData.message);
          if (rawData.errors) {
            if (rawData.errors.fullname) {
              fullnameError.textContent = rawData.errors.fullname;
              fullnameError.classList.remove("hidden");
              fullnameInput.classList.add("border-red-500/50!");
            }
            if (rawData.errors.email) {
              emailError.textContent = rawData.errors.email;
              emailError.classList.remove("hidden");
              emailInput.classList.add("border-red-500/50!");
            }
            if (rawData.errors.message) {
              messageError.textContent = rawData.errors.message;
              messageError.classList.remove("hidden");
              messageInput.classList.add("border-red-500/50!");
            }
            if (rawData.errors.captcha) {
              showCaptchaError(rawData.errors.captcha);
              resetCaptcha(true);
            }
          }
        }
      } else {
        showBanner(false, "Invalid response received. Please try again later.");
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Contact form error:", errorMsg);
      showBanner(false, "Failed to send message. Please try again later.");
    } finally {
      setPending(false);
    }
  };

  form.addEventListener("submit", (e: Event): void => {
    void handleSubmit(e);
  });
};

document.addEventListener("astro:page-load", setupContactPage);
