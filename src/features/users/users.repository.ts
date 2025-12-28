import { db } from "@config/db";
import { users } from "@config/db/schema";
import { eq } from "drizzle-orm";
import type { CreateUserDTO, UpdateUserDTO, User } from "./types";

export class UsersRepository {
	async create(user: CreateUserDTO): Promise<User> {
		const [newUser] = await db.insert(users).values(user).returning();

		return newUser as User;
	}

	async findById(id: string): Promise<User | undefined> {
		const [user] = await db.select().from(users).where(eq(users.id, id));

		return user;
	}

	async findByEmail(email: string): Promise<User | undefined> {
		const [user] = await db.select().from(users).where(eq(users.email, email));

		return user;
	}

	async findAll(): Promise<User[]> {
		return db.select().from(users);
	}

	async update({ id, ...userData }: UpdateUserDTO): Promise<User | undefined> {
		const [updatedUser] = await db
			.update(users)
			.set(userData)
			.where(eq(users.id, id))
			.returning();

		return updatedUser;
	}

	async delete(id: string): Promise<void> {
		await db.delete(users).where(eq(users.id, id));
	}

	async verifyUserEmail(id: string): Promise<void> {
		await db
			.update(users)
			.set({ isEmailVerified: true })
			.where(eq(users.id, id));
	}
}
