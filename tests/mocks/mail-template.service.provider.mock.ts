import type { MailTemplateDTO, MailTemplateServiceProvider } from "@src/shared/providers/mail-templating/interfaces/MailTemplateServiceProvider";

export class MockMailTemplateServiceProvider implements MailTemplateServiceProvider {
	private formattedTemplates: Array<{ name: string; variables: Record<string, unknown>; result: string }> = [];

	async format<T extends MailTemplateDTO>(data: T): Promise<string> {
		const { name, variables } = data;

		// Simple template formatting - just returns a string with the variables embedded
		const result = `Template: ${name}\nVariables: ${JSON.stringify(variables)}`;

		this.formattedTemplates.push({
			name,
			variables,
			result,
		});

		return result;
	}

	// Helper methods for testing
	getFormattedTemplates(): Array<{ name: string; variables: Record<string, unknown>; result: string }> {
		return this.formattedTemplates;
	}

	getLastFormattedTemplate(): { name: string; variables: Record<string, unknown>; result: string } | undefined {
		return this.formattedTemplates[this.formattedTemplates.length - 1];
	}

	getFormattedTemplatesByName(name: string): Array<{ name: string; variables: Record<string, unknown>; result: string }> {
		return this.formattedTemplates.filter((template) => template.name === name);
	}

	reset(): void {
		this.formattedTemplates = [];
	}
}
