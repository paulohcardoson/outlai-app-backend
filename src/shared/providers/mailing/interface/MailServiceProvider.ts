export interface MailServiceProvider {
  verify(): Promise<boolean>;
  sendMail(data: SendEmailDTO): Promise<void>;
}

export interface SendEmailDTO {
  to: string;
  subject: string;
  html: string;
}