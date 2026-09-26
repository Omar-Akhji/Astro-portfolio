export interface ContactFieldErrors {
  readonly fullname?: string;
  readonly email?: string;
  readonly message?: string;
}

export type ContactFormState =
  | { readonly success: true; readonly message: string; readonly errors?: never }
  | { readonly success: false; readonly message: string; readonly errors?: ContactFieldErrors };

export interface ContactPayload {
  readonly fullname: string;
  readonly email: string;
  readonly message: string;
}
