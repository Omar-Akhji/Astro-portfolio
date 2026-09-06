export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: { fullname?: string; email?: string; message?: string };
}
