import "reflect-metadata";

import { AuthService } from "@features/auth/auth.service";
import { UsersService } from "@features/users/users.service";
import { beforeEach, describe, expect, it } from "@jest/globals";
import { AppError } from "@shared/errors/AppError";
import {
	MockCacheServiceProvider,
	MockMailServiceProvider,
	MockMailTemplateServiceProvider,
} from "./mocks";
import { MockUsersRepository } from "./mocks/users.repository.mock";

describe("Testando Usuários", () => {
	let mockUsersRepository: MockUsersRepository;
	let usersService: UsersService;
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
		usersService = new UsersService(mockUsersRepository, authService);
	});

	// Sucessos
	describe("Listar Usuários", () => {
		it("Deve listar todos os Usuários", async () => {
			const users = await usersService.getAllUsers();
			expect(users).toEqual([]);
		});

		it("Deve listar Usuários criados", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			await authService.register({
				name: "Maria Santos",
				email: "maria@example.com",
				password: "senha456",
			});

			const users = await usersService.getAllUsers();
			expect(users).toHaveLength(2);
		});
	});

	describe("Buscar Usuário", () => {
		it("Deve buscar um Usuário por ID", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const createdUser = await mockUsersRepository.findByEmail("joao@example.com");

			if (!createdUser) {
				throw new Error("Usuário não foi criado");
			}

			const foundUser = await usersService.getUserById(createdUser.id);

			expect(foundUser).toEqual(createdUser);
			expect(foundUser.name).toBe("João Silva");
			expect(foundUser.email).toBe("joao@example.com");
		});

		it("Deve buscar um Usuário por email", async () => {
			await authService.register({
				name: "Maria Santos",
				email: "maria@example.com",
				password: "senha456",
			});

			const foundUser = await usersService.getUserByEmail("maria@example.com");

			expect(foundUser.name).toBe("Maria Santos");
			expect(foundUser.email).toBe("maria@example.com");
		});
	});

	describe("Atualizar Usuário", () => {
		it("Deve atualizar o nome de um Usuário", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const createdUser = await mockUsersRepository.findByEmail("joao@example.com");

			if (!createdUser) {
				throw new Error("Usuário não foi criado");
			}

			const updatedUser = await usersService.updateUser({
				id: createdUser.id,
				name: "João Santos Silva",
			});

			expect(updatedUser.name).toBe("João Santos Silva");
			expect(updatedUser.email).toBe("joao@example.com");
		});

		it("Deve atualizar o email de um Usuário", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const createdUser = await mockUsersRepository.findByEmail("joao@example.com");

			if (!createdUser) {
				throw new Error("Usuário não foi criado");
			}

			const updatedUser = await usersService.updateUser({
				id: createdUser.id,
				email: "joao.novo@example.com",
			});

			expect(updatedUser.name).toBe("João Silva");
			expect(updatedUser.email).toBe("joao.novo@example.com");
		});

		it("Deve atualizar nome e email simultaneamente", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const createdUser = await mockUsersRepository.findByEmail("joao@example.com");

			if (!createdUser) {
				throw new Error("Usuário não foi criado");
			}

			const updatedUser = await usersService.updateUser({
				id: createdUser.id,
				name: "João Santos",
				email: "joao.santos@example.com",
			});

			expect(updatedUser.name).toBe("João Santos");
			expect(updatedUser.email).toBe("joao.santos@example.com");
		});
	});

	describe("Deletar Usuário", () => {
		it("Deve deletar um Usuário com senha correta", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const createdUser = await mockUsersRepository.findByEmail("joao@example.com");

			if (!createdUser) {
				throw new Error("Usuário não foi criado");
			}

			await usersService.deleteUser({
				id: createdUser.id,
				password: "senha123",
			});

			await expect(
				usersService.getUserById(createdUser.id)
			).rejects.toThrow(AppError);
		});
	});

	// Erros
	describe("Erros - Buscar Usuário", () => {
		it("Não deve encontrar um Usuário com ID inexistente", async () => {
			await expect(
				usersService.getUserById("id-inexistente")
			).rejects.toThrow(new AppError("Usuário não encontrado", 404));
		});

		it("Não deve encontrar um Usuário com email inexistente", async () => {
			await expect(
				usersService.getUserByEmail("naoexiste@example.com")
			).rejects.toThrow(new AppError("Usuário não encontrado", 404));
		});
	});

	describe("Erros - Atualizar Usuário", () => {
		it("Não deve atualizar um Usuário com ID inexistente", async () => {
			await expect(
				usersService.updateUser({
					id: "id-inexistente",
					name: "Novo Nome",
				})
			).rejects.toThrow(new AppError("Usuário não encontrado", 404));
		});

		it("Não deve atualizar email para um já existente", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			await authService.register({
				name: "Maria Santos",
				email: "maria@example.com",
				password: "senha456",
			});

			const user2 = await mockUsersRepository.findByEmail("maria@example.com");

			if (!user2) {
				throw new Error("Usuário 2 não foi criado");
			}

			await expect(
				usersService.updateUser({
					id: user2.id,
					email: "joao@example.com",
				})
			).rejects.toThrow(new AppError("Usuário com este email já existe", 409));
		});
	});

	describe("Erros - Deletar Usuário", () => {
		it("Não deve deletar um Usuário com ID inexistente", async () => {
			await expect(
				usersService.deleteUser({
					id: "id-inexistente",
					password: "senha123",
				})
			).rejects.toThrow(new AppError("Usuário não encontrado", 404));
		});

		it("Não deve deletar um Usuário com senha incorreta", async () => {
			await authService.register({
				name: "João Silva",
				email: "joao@example.com",
				password: "senha123",
			});

			const createdUser = await mockUsersRepository.findByEmail("joao@example.com");

			if (!createdUser) {
				throw new Error("Usuário não foi criado");
			}

			await expect(
				usersService.deleteUser({
					id: createdUser.id,
					password: "senhaerrada",
				})
			).rejects.toThrow(new AppError("Senha incorreta", 401));
		});
	});
});
