/// <reference types="astro/client" />

declare global {
  interface ImportMetaEnv {
    readonly RESEND_API_KEY?: string;
    readonly CONTACT_TO_EMAIL?: string;
    readonly RESEND_FROM_EMAIL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface AstroBeforePreparationEvent extends Event {
    readonly to: URL;
    readonly from: URL;
    readonly direction: "forward" | "back";
    readonly navigationType: "push" | "replace" | "traverse";
    readonly sourceElement?: Element;
    readonly loader: () => Promise<void>;
  }

  interface DocumentEventMap {
    "astro:before-preparation": AstroBeforePreparationEvent;
    "astro:after-swap": Event;
    "astro:page-load": Event;
  }
}

export {};
