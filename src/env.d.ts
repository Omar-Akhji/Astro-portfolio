/// <reference types="astro/client" />
/// <reference lib="es2023.array" />
/// <reference lib="esnext" />

declare global {
  interface ImportMetaEnv {
    readonly SMTP_HOST?: string;
    readonly SMTP_PORT?: string;
    readonly SMTP_SECURE?: string;
    readonly SMTP_USER?: string;
    readonly SMTP_PASS?: string;
    readonly CONTACT_TO_EMAIL?: string;
    readonly CONTACT_FROM_EMAIL?: string;
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
