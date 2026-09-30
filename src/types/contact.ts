export interface ContactFieldErrors {
  readonly fullName?: string;
  readonly email?: string;
  readonly message?: string;
  readonly captcha?: string;
}

export type ContactFormState =
  | { readonly success: true; readonly message: string; readonly errors?: never }
  | { readonly success: false; readonly message: string; readonly errors?: ContactFieldErrors };

export interface ContactPayload {
  readonly fullName: string;
  readonly email: string;
  readonly message: string;
  readonly captchaToken: string;
}
