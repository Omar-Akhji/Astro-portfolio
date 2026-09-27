import type { ContactFormState } from "@/types";

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
  ) {
    return;
  }

  const setPending = (pending: boolean): void => {
    submitBtn.disabled = pending;
    fullnameInput.disabled = pending;
    emailInput.disabled = pending;
    messageInput.disabled = pending;

    if (pending) {
      submitSpinner.classList.remove("hidden");
      submitIcon.classList.add("hidden");
      submitLabel.textContent = "Sending...";
    } else {
      submitSpinner.classList.add("hidden");
      submitIcon.classList.remove("hidden");
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
    setPending(true);

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });

      const rawData: unknown = await response.json();

      if (isContactFormState(rawData)) {
        if (response.ok && rawData.success) {
          showBanner(true, rawData.message);
          form.reset();
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
