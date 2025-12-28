import type { MailServiceProvider, SendEmailDTO } from "@src/shared/providers/mailing/interface/MailServiceProvider";

interface SentEmail extends SendEmailDTO {
	sentAt: Date;
}

export class MockMailServiceProvider implements MailServiceProvider {
	private sentEmails: SentEmail[] = [];
	private isVerified = true;

	async verify(): Promise<boolean> {
		return this.isVerified;
	}

	async sendMail(data: SendEmailDTO): Promise<void> {
		this.sentEmails.push({
			...data,
			sentAt: new Date(),
		});
	}

	// Helper methods for testing
	getSentEmails(): SentEmail[] {
		return this.sentEmails;
	}

	getLastSentEmail(): SentEmail | undefined {
		return this.sentEmails[this.sentEmails.length - 1];
	}

	getSentEmailsTo(email: string): SentEmail[] {
		return this.sentEmails.filter((sentEmail) => sentEmail.to === email);
	}

	setVerified(verified: boolean): void {
		this.isVerified = verified;
	}

	reset(): void {
		this.sentEmails = [];
		this.isVerified = true;
	}
}
