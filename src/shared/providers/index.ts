import { AuthService } from "@features/auth/auth.service";
import { ExpensesRepository } from "@features/expenses/expenses.repository";
import { ExpensesService } from "@features/expenses/expenses.service";
import { UsersRepository } from "@features/users/users.repository";
import { UsersService } from "@features/users/users.service";
import { container } from "tsyringe";
import { AIServiceProvider } from "./ai";
import type { AIServiceProvider as AIServiceProviderInterface } from "./ai/interface/AIServiceProvider";
import { cacheServiceProvider } from "./cache";
import type { CacheServiceProvider } from "./cache/interface/CacheServiceProvider";
import { mailTemplateService } from "./mail-templating";
import type { MailTemplateServiceProvider } from "./mail-templating/interfaces/MailTemplateServiceProvider";
import { mailtrapMailService } from "./mailing";
import type { MailServiceProvider } from "./mailing/interface/MailServiceProvider";

// Repositories
container.registerSingleton<UsersRepository>("UsersRepository", UsersRepository);
container.registerSingleton<ExpensesRepository>("ExpensesRepository", ExpensesRepository);

// Services
container.registerSingleton<UsersService>("UsersService", UsersService);
container.registerSingleton<AuthService>("AuthService", AuthService);
container.registerSingleton<ExpensesService>("ExpensesService", ExpensesService);

// Cache
container.register<CacheServiceProvider>("CacheServiceProvider", { useValue: cacheServiceProvider });

// Mailing Service
container.register<MailServiceProvider>("MailServiceProvider", { useValue: mailtrapMailService });

// Mail Templating Service
container.register<MailTemplateServiceProvider>("MailTemplateServiceProvider", { useValue: mailTemplateService });

// AI Service
container.register<AIServiceProviderInterface>("AIServiceProvider", { useValue: AIServiceProvider });
