import type { users } from "@config/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

export interface UpdateUserDTO {
	id: string;
	name?: string;
	email?: string;
	password?: string;
}

export interface DeleteUserDTO {
	id: string;
}

export interface DeleteUserDTOWithPassword {
	id: string;
	password: string;
}