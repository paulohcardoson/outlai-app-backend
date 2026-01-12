export interface MailTemplateServiceProvider {
	format<T extends MailTemplateDTO>(data: T): Promise<string>;
}

// biome-ignore lint/suspicious/noExplicitAny: <>
export interface MailTemplateDTO<File = string, T = Record<string, any>> {
	name: File;
	variables: T;
}

export type EmailCodeVerificationTemplateVariables = MailTemplateDTO<
	"email-verification.njk",
	{
		name: string;
		verifyUrl: string;
		expirationTime: number;
		currentYear: number;
	}
>;

export type PasswordResetTemplateVariables = MailTemplateDTO<
	"password-reset.njk",
	{
		name: string;
		resetUrl: string;
		expirationTime: number;
		currentYear: number;
	}
>;
