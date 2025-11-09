import type { expenses } from "@src/config/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Expense = InferSelectModel<typeof expenses>;

export interface CreateExpenseDTO {
	userId: string;
	description: string;
	amount: number;
	category: string;
	date: string;
}

export interface UpdateExpenseDTO {
	description?: string;
	amount?: number;
	category?: string;
	date?: string;
}
