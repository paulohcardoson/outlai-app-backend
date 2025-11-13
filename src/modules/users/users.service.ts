import { env } from "@src/config/env";
import { AppError } from "@src/shared/errors/AppError";
import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import type { CreateUserDTO, UpdateUserDTO, User } from "./types";
import type { UsersRepository } from "./users.repository";

@injectable()
export class UsersService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) { }

	async createUser(userData: CreateUserDTO): Promise<User | undefined> {
		// Check if email already exists
		const existingUser = await this.usersRepository.findByEmail(userData.email);

		if (existingUser) {
			throw new AppError("Usuário com este email já existe", 409);
		}

		const hashedPassword = await bcrypt.hash(
			userData.password,
			env.PASSWORD_SALT_ROUNDS,
		);

		return this.usersRepository.create({
			...userData,
			password: hashedPassword,
		});
	}

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
		id: string,
		userData: Partial<UpdateUserDTO>,
	): Promise<User> {
		// If email is being updated, check if it already exists
		if (userData.email) {
			const existingUser = await this.usersRepository.findByEmail(
				userData.email,
			);

			if (existingUser && existingUser.id !== id) {
				throw new AppError("Usuário com este email já existe", 409);
			}
		}

		const updatedUser = await this.usersRepository.update(id, userData);

		if (!updatedUser) {
			throw new AppError("Usuário não encontrado", 404);
		}

		return updatedUser;
	}

	async deleteUser(id: string): Promise<void> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new AppError("Usuário não encontrado", 404);
		}

		await this.usersRepository.delete(id);
	}
}
