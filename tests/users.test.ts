import "reflect-metadata";

import { describe, it, expect, beforeEach } from "@jest/globals";
import { MockUsersRepository } from "./mocks/users.repository.mock";
import { UsersService } from "@src/modules/users/users.service";
import { AppError } from "@src/shared/errors/AppError";

describe("Testando usuários", () => {
	let mockUserRepository: MockUsersRepository;
	let usersService: UsersService;

	beforeEach(() => {
		mockUserRepository = new MockUsersRepository();
		usersService = new UsersService(mockUserRepository);
	});

	// Sucessos
	it("Deve listar todos os usuários", async () => {
		const users = await usersService.getAllUsers();
		expect(users).toEqual([]);
	});

	it("Deve criar um novo usuário", async () => {
		const newUser = await usersService.createUser({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "securepassword",
		});

		if (!newUser) {
			throw new Error("Usuário não foi criado");
		}

		expect(newUser).toHaveProperty("id");
		expect(newUser).toHaveProperty("name", "John Doe");
		expect(newUser).toHaveProperty("email", "john.doe@example.com");
		expect(newUser).toHaveProperty("password");
		expect(newUser).toHaveProperty("createdAt");

		// Verificar se a senha está hashada
		expect(newUser.password).not.toBe("securepassword");
	});

	it("Deve buscar um usuário por ID", async () => {
		const createdUser = await usersService.createUser({
			name: "Jane Doe",
			email: "jane.doe@example.com",
			password: "securepassword",
		});

		if (!createdUser) {
			throw new Error("Usuário não foi criado");
		}

		const foundUser = await usersService.getUserById(createdUser.id);

		expect(foundUser).toEqual(createdUser);
	});

	it("Deve buscar um usuário por email", async () => {
		const createdUser = await usersService.createUser({
			name: "Bob Smith",
			email: "bob.smith@example.com",
			password: "securepassword",
		});

		if (!createdUser) {
			throw new Error("Usuário não foi criado");
		}

		const foundUser = await usersService.getUserByEmail(createdUser.email);

		expect(foundUser).toEqual(createdUser);
	});

	it("Deve atualizar um usuário", async () => {
		const createdUser = await usersService.createUser({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "securepassword",
		});

		if (!createdUser) {
			throw new Error("Usuário não foi criado");
		}

		const updatedUser = await usersService.updateUser(createdUser.id, {
			name: "Alice Updated",
			email: "alice.updated@example.com",
			password: "newsecurepassword",
		});

		expect(updatedUser).toEqual({
			id: createdUser.id,
			name: "Alice Updated",
			email: "alice.updated@example.com",
			password: expect.any(String),
			createdAt: expect.any(Date),
		});
	});

	it("Deve deletar um usuário", async () => {
		const createdUser = await usersService.createUser({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "securepassword",
		});

		if (!createdUser) {
			throw new Error("Usuário não foi criado");
		}

		await usersService.deleteUser(createdUser.id);

		expect(usersService.getUserById(createdUser.id)).rejects.toThrow(AppError);
	});

	// Erros
	it("Não deve criar um usuário com email duplicado", async () => {
		await usersService.createUser({
			name: "Alice",
			email: "alice@example.com",
			password: "securepassword",
		});

		expect(usersService.createUser({
			name: "Alice",
			email: "alice@example.com",
			password: "securepassword",
		})).rejects.toThrow(AppError);
	});

	it("Não deve encontrar um usuário com ID inexistente", async () => {
		expect(usersService.getUserById("non-existent-id")).rejects.toThrow(AppError);
	});

	it("Não deve encontrar um usuário com email inexistente", async () => {
		expect(usersService.getUserByEmail("non-existent-email@example.com")).rejects.toThrow(AppError);
	});

	it("Não deve atualizar um usuário com email duplicado", async () => {
		const user1 = await usersService.createUser({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "securepassword",
		});

		if (!user1) {
			throw new Error("Usuário 1 não foi criado");
		}

		const user2 = await usersService.createUser({
			name: "Jane Doe",
			email: "jane.doe@example.com",
			password: "securepassword",
		});

		if (!user2) {
			throw new Error("Usuário 2 não foi criado");
		}

		expect(usersService.updateUser(user2.id, {
			name: "User Two",
			email: user1.email,
			password: "newpassword",
		})).rejects.toThrow(AppError);
	});

	it("Não deve atualizar um usuário com ID inexistente", async () => {
		expect(usersService.updateUser("non-existent-id", { name: "New Name" })).rejects.toThrow(AppError);
	});

	it("Não deve deletar um usuário com ID inexistente", async () => {
		expect(usersService.deleteUser("non-existent-id")).rejects.toThrow(AppError);
	});
});
