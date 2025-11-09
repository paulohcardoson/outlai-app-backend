import type { users } from "@src/config/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

export interface UpdateUserDTO {
	name?: string;
	email?: string;
	password?: string;
}
