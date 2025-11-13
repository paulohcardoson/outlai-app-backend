import { env } from "@src/config/env";
import { AppError } from "@src/shared/errors/AppError";
import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import type { UsersRepository } from "../users/users.repository";
import type { LoginDTO, RegisterDTO } from "./types";

@injectable()
export class AuthService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) { }

	async login(credentials: LoginDTO): Promise<void> {
		const user = await this.usersRepository.findByEmail(credentials.email);

		if (!user) {
			throw new AppError("Credenciais inválidas", 401);
		}

		const isPasswordValid = await bcrypt.compare(
			credentials.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new AppError("Credenciais inválidas", 401);
		}
	}

	async register(userData: RegisterDTO): Promise<void> {
		// Check if email already exists
		const existingUser = await this.usersRepository.findByEmail(userData.email);

		if (existingUser) {
			throw new AppError("Usuário com este email já existe", 409);
		}

		const hashedPassword = await bcrypt.hash(
			userData.password,
			env.PASSWORD_SALT_ROUNDS,
		);

		const newUser = await this.usersRepository.create({
			...userData,
			password: hashedPassword,
		});

		if (!newUser) {
			throw new AppError("Erro ao criar usuário", 500);
		}

		// Remove password from response
		const { password: _ } = newUser;
	}
}
