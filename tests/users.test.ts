import "reflect-metadata";

import { describe, it, expect, beforeEach } from "bun:test";
import { MockUsersRepository } from "./mocks/users.repository.mock";
import { UsersService } from "@src/modules/users/users.service";

describe("Testando usuários", () => {
	let mockUserRepository: MockUsersRepository;
	let usersService: UsersService;

	beforeEach(() => {
		mockUserRepository = new MockUsersRepository();
		usersService = new UsersService(mockUserRepository);
	});

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
});
