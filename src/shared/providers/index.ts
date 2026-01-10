import { env } from "@config/env";
import { AuthService } from "@features/auth/auth.service";
import { ExpensesRepository } from "@features/expenses/expenses.repository";
import { ExpensesService } from "@features/expenses/expenses.service";
import { UsersRepository } from "@features/users/users.repository";
import { UsersService } from "@features/users/users.service";
import { container } from "tsyringe";
import { providers as aiProviders } from "./ai";
import type { AIServiceProvider } from "./ai/interface/AIServiceProvider";
import { providers as cacheProviders } from "./cache";
import type { CacheServiceProvider } from "./cache/interface/CacheServiceProvider";
import { providers as mailTemplateProviders } from "./mail-templating";
import type { MailTemplateServiceProvider } from "./mail-templating/interfaces/MailTemplateServiceProvider";
import { providers as mailProviders } from "./mailing";
import type { MailServiceProvider } from "./mailing/interface/MailServiceProvider";

// Repositories
container.registerSingleton<UsersRepository>(
	"UsersRepository",
	UsersRepository,
);
container.registerSingleton<ExpensesRepository>(
	"ExpensesRepository",
	ExpensesRepository,
);

// Services
container.registerSingleton<UsersService>("UsersService", UsersService);
container.registerSingleton<AuthService>("AuthService", AuthService);
container.registerSingleton<ExpensesService>(
	"ExpensesService",
	ExpensesService,
);

// Cache
container.register<CacheServiceProvider>("CacheServiceProvider", {
	useValue: cacheProviders[env.APP_MODE](),
});

// Mailing Service
container.register<MailServiceProvider>("MailServiceProvider", {
	useValue: mailProviders[env.APP_MODE](),
});

// Mail Templating Service
container.register<MailTemplateServiceProvider>("MailTemplateServiceProvider", {
	useValue: mailTemplateProviders[env.APP_MODE](),
});

// AI Service
container.register<AIServiceProvider>("AIServiceProvider", {
	useValue: aiProviders[env.APP_MODE](),
});
