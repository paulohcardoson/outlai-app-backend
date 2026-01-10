import fs from "node:fs";
import path from "node:path";
import { env } from "@src/shared/config/env";
import nunjucks from "nunjucks";
import type {
	MailTemplateDTO,
	MailTemplateServiceProvider,
} from "../interfaces/MailTemplateServiceProvider";

// Build path to templates folder - works in both dev and production
export const templatesFolder =
	env.APP_MODE !== "production"
		? path.resolve(
				import.meta.dirname,
				"..",
				"..",
				"..",
				"views",
				"mails",
				"templates",
			)
		: path.resolve(
				import.meta.dirname,
				"..",
				"shared",
				"views",
				"mails",
				"templates",
			);

export class NunjucksMailTemplateServiceProvider
	implements MailTemplateServiceProvider
{
	constructor() {
		nunjucks.configure({ autoescape: false });
	}

	async format<T extends MailTemplateDTO>(data: T): Promise<string> {
		const { name, variables } = data;

		const filePath = path.resolve(templatesFolder, name);
		const fileContent = await fs.promises.readFile(filePath, "utf-8");

		return nunjucks.renderString(fileContent, variables);
	}
}
