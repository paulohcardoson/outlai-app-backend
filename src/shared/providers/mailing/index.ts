import type { Providers } from "../types/providers";
import { MailgunMailServiceProvider } from "./implementations/MailgunMailServiceProvider";
import { MailtrapMailServiceProvider } from "./implementations/MailtrapMailServiceProvider";
import type { MailServiceProvider } from "./interface/MailServiceProvider";

export const providers: Providers<MailServiceProvider> = {
	production: () => new MailgunMailServiceProvider(),
	development: () => new MailtrapMailServiceProvider(),
};
