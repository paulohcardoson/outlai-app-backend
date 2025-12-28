import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import type { AuthService } from "../auth/auth.service";
import type { DeleteUserDTOWithPassword, UpdateUserDTO, User } from "./types";
import type { UsersRepository } from "./users.repository";

@injectable()
export class UsersService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,

		@inject("AuthService")
		private authService: AuthService,
	) { }

	async getUserById(id: string): Promise<User> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new AppError("Usuário não encontrado", 404);
		}

		return user;
	}

	async getUserByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError("Usuário não encontrado", 404);
		}

		return user;
	}

	async getAllUsers(): Promise<User[]> {
		return this.usersRepository.findAll();
	}

	async updateUser(
		data: UpdateUserDTO,
	): Promise<User> {
		const { id, ...userData } = data;

		// If email is being updated, check if it already exists
		if (userData.email) {
			const existingUser = await this.usersRepository.findByEmail(
				userData.email,
			);

			if (existingUser && existingUser.id !== id) {
				throw new AppError("Usuário com este email já existe", 409);
			}
		}

		const updatedUser = await this.usersRepository.update(data);

		if (!updatedUser) {
			throw new AppError("Usuário não encontrado", 404);
		}

		return updatedUser;
	}

	async deleteUser(data: DeleteUserDTOWithPassword): Promise<void> {
		const user = await this.usersRepository.findById(data.id);

		if (!user) {
			throw new AppError("Usuário não encontrado", 404);
		}

		const passwordsMatch = await this.authService.checkPassword({
			password: data.password,
			hashedPassword: user.password,
		});

		if (!passwordsMatch) {
			throw new AppError("Senha incorreta", 401);
		}

		await this.usersRepository.delete(data.id);
	}
}
