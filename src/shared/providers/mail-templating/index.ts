import type { Providers } from "../types/providers";
import { NunjucksMailTemplateServiceProvider } from "./implementations/NunjucksMailTemplateServiceProvider";
import type { MailTemplateServiceProvider } from "./interfaces/MailTemplateServiceProvider";

export const providers: Providers<MailTemplateServiceProvider> = {
	production: () => new NunjucksMailTemplateServiceProvider(),
	development: () => new NunjucksMailTemplateServiceProvider(),
};