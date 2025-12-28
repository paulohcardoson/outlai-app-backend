export interface MailTemplateServiceProvider {
  format<T extends MailTemplateDTO>(data: T): Promise<string>
}

// biome-ignore lint/suspicious/noExplicitAny: <>
export interface MailTemplateDTO<File = string, T = Record<string, any>> {
  name: File;
  variables: T;
}

export type EmailCodeVerificationTemplateVariables = MailTemplateDTO<"email-verification.njk", {
  name: string;
  app_url: string;
  token: string;
  userId: string;
  expirationTime: number;
  currentYear: number;
}>
