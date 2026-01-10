import { env } from "@src/shared/config/env";
import Mailgun from "mailgun.js";
import type {
	MailServiceProvider,
	SendEmailDTO,
} from "../interface/MailServiceProvider";

export class MailgunMailServiceProvider implements MailServiceProvider {
	mailgun;
	client;

	constructor() {
		this.mailgun = new Mailgun(FormData);
		this.client = this.mailgun.client({
			username: "api",
			key: env.MAILGUN_API_KEY,
		});
	}

	async sendMail(data: SendEmailDTO): Promise<void> {
		try {
			await this.client.messages.create(env.MAILGUN_DOMAIN, {
				from: "Outlai <outlai-noreply@paulohcardoson.me>",
				to: [data.to],
				subject: data.subject,
				html: data.html,
			});
		} catch (error) {
			console.error("Error sending email via Mailgun:", error);
			throw error;
		}
	}

	async verify(): Promise<boolean> {
		return true;
	}
}
