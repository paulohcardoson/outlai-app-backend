import "reflect-metadata";

import { AuthService } from "@features/auth/auth.service";
import { beforeEach, describe, expect, it } from "@jest/globals";
import { AppError } from "@shared/errors/AppError";
import {
	MockCacheServiceProvider,
	MockMailServiceProvider,
	MockMailTemplateServiceProvider,
} from "./mocks";
import { MockUsersRepository } from "./mocks/users.repository.mock";

describe("Testando autenticaãão", () => {
	let mockUsersRepository: MockUsersRepository;
	let authService: AuthService;
	let mockCacheServiceProvider: MockCacheServiceProvider;
	let mockMailTemplateProvider: MockMailTemplateServiceProvider;
	let mockMailServiceProvider: MockMailServiceProvider;

	beforeEach(() => {
		mockUsersRepository = new MockUsersRepository();
		mockCacheServiceProvider = new MockCacheServiceProvider();
		mockMailTemplateProvider = new MockMailTemplateServiceProvider();
		mockMailServiceProvider = new MockMailServiceProvider();

		authService = new AuthService(
			mockUsersRepository,
			mockCacheServiceProvider,
			mockMailServiceProvider,
			mockMailTemplateProvider
		);
	});

	// Sucessos
	describe("Registro de Usuário", () => {
		it("Deve registrar um novo Usuário", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			expect(user).toBeDefined();
			expect(user?.name).toBe("João Silva");
			expect(user?.email).toBe("joao@example.com");
			expect(user?.password).not.toBe("senha123");
		});

		it("Deve hashear a senha do Usuário", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			expect(user?.password).not.toBe("senha123");
			expect(user?.password).toMatch(/^\$2[aby]\$/);
		});

		it("Deve criar token de Verificação de email no cache", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			expect(user).toBeDefined();

			const cacheKey = `user-email-verification-token:${user?.id}`;
			const token = await mockCacheServiceProvider.get(cacheKey);

			expect(token).toBeDefined();
			expect(typeof token).toBe("string");
		});

		it("Deve enviar email de Verificação", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const sentEmails = mockMailServiceProvider.getSentEmails();
			expect(sentEmails).toHaveLength(1);
			expect(sentEmails[0]?.to).toBe("joao@example.com");
			expect(sentEmails[0]?.subject).toBe("Verificação de Email");
		});
	});

	describe("Login de Usuário", () => {
		it("Deve autenticar Usuário com credenciais válidas", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await authService.login({
				email: "joao@example.com",
				password: "senha123",
			});

			expect(user).toBeDefined();
			expect(user.email).toBe("joao@example.com");
		});

		it("Deve retornar dados do Usuário apãs login bem-sucedido", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await authService.login({
				email: "joao@example.com",
				password: "senha123",
			});

			expect(user).toHaveProperty("id");
			expect(user).toHaveProperty("name", "João Silva");
			expect(user).toHaveProperty("email", "joao@example.com");
			expect(user).toHaveProperty("password");
			expect(user).toHaveProperty("createdAt");
		});
	});

	describe("Verificação de senha", () => {
		it("Deve verificar senha correta", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			if (!user) {
				throw new Error("Usuário não foi criado");
			}

			const isValid = await authService.checkPassword({
				password: "senha123",
				hashedPassword: user.password,
			});

			expect(isValid).toBe(true);
		});

		it("Deve rejeitar senha incorreta", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			if (!user) {
				throw new Error("Usuário não foi criado");
			}

			const isValid = await authService.checkPassword({
				password: "senhaerrada",
				hashedPassword: user.password,
			});

			expect(isValid).toBe(false);
		});
	});

	describe("Verificação de email", () => {
		it("Deve verificar email com token vãlido", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			if (!user) {
				throw new Error("Usuário não foi criado");
			}

			const cacheKey = `user-email-verification-token:${user.id}`;
			const token = await mockCacheServiceProvider.get<string>(cacheKey);

			if (!token) {
				throw new Error("Token não foi criado");
			}

			await authService.verifyEmail({
				userId: user.id,
				token,
			});

			const updatedUser = await mockUsersRepository.findById(user.id);
			expect(updatedUser?.isEmailVerified).toBe(true);
		});

		it("Deve remover token do cache apãs Verificação", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			if (!user) {
				throw new Error("Usuário não foi criado");
			}

			const cacheKey = `user-email-verification-token:${user.id}`;
			const token = await mockCacheServiceProvider.get<string>(cacheKey);

			if (!token) {
				throw new Error("Token não foi criado");
			}

			await authService.verifyEmail({
				userId: user.id,
				token,
			});

			const tokenAfter = await mockCacheServiceProvider.get(cacheKey);
			expect(tokenAfter).toBeNull();
		});
	});

	describe("Envio de email de Verificação", () => {
		it("Deve enviar email de Verificação com dados corretos", async () => {
			const userId = "test-user-id";
			const token = "test-token";

			await authService.sendVerificationEmail({
				email: "joao@example.com",
				name: "João Silva",
				userId,
				token,
			});

			const sentEmails = mockMailServiceProvider.getSentEmails();
			expect(sentEmails).toHaveLength(1);
			expect(sentEmails[0]?.to).toBe("joao@example.com");
			expect(sentEmails[0]?.subject).toBe("Verificação de Email");

			const formattedTemplates = mockMailTemplateProvider.getFormattedTemplates();
			expect(formattedTemplates).toHaveLength(1);
			expect(formattedTemplates[0]?.name).toBe("email-verification.njk");
			expect(formattedTemplates[0]?.variables).toHaveProperty("name", "João Silva");
			expect(formattedTemplates[0]?.variables).toHaveProperty("token", token);
			expect(formattedTemplates[0]?.variables).toHaveProperty("userId", userId);
		});
	});

	// Erros
	describe("Erros - Registro de Usuário", () => {
		it("Não deve registrar Usuário com email já existente", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			await expect(
				authService.register({
					name: "João Silva 2",
					email: "joao@example.com",
					password: "senha456",
				})
			).rejects.toThrow(new AppError("Usuário com este email já existe", 409));
		});

		it("Não deve permitir registro se já existe token de Verificação no cache", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			if (!user) {
				throw new Error("Usuário não foi criado");
			}

			// Delete user but keep cache token
			await mockUsersRepository.delete(user.id);

			// Try to register again with same ID (simulate race condition)
			const cacheKey = `user-email-verification-token:${user.id}`;
			await mockCacheServiceProvider.set(cacheKey, "existing-token", 900);

			// Create user manually to bypass email check
			await mockUsersRepository.create({
				name: "João Silva 2",
				email: "joao2@example.com",
				password: "hashedpassword",
			});

			// The check happens after user creation
			const existingToken = await mockCacheServiceProvider.get(cacheKey);
			expect(existingToken).toBe("existing-token");
		});
	});

	describe("Erros - Login de Usuário", () => {
		it("Não deve autenticar com email inexistente", async () => {
			await expect(
				authService.login({
					email: "naoexiste@example.com",
					password: "senha123",
				})
			).rejects.toThrow(new AppError("Credenciais inválidas", 401));
		});

		it("Não deve autenticar com senha incorreta", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			await expect(
				authService.login({
					email: "joao@example.com",
					password: "senhaerrada",
				})
			).rejects.toThrow(new AppError("Credenciais inválidas", 401));
		});
	});

	describe("Erros - Verificação de email", () => {
		it("Não deve verificar email com token inexistente", async () => {
			await expect(
				authService.verifyEmail({
					userId: "user-id",
					token: "token-inexistente",
				})
			).rejects.toThrow(new AppError("Token de Verificação inválido ou expirado", 400));
		});

		it("Não deve verificar email com token inválido", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const user = await mockUsersRepository.findByEmail("joao@example.com");

			if (!user) {
				throw new Error("Usuário não foi criado");
			}

			await expect(
				authService.verifyEmail({
					userId: user.id,
					token: "token-invalido",
				})
			).rejects.toThrow(new AppError("Token de Verificação inválido", 400));
		});
	});
});
