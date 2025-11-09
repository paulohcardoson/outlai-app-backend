import { db } from "@config/db";
import { eq } from "drizzle-orm";
import { expenses } from "../../config/db/schema";
import type { CreateExpenseDTO, UpdateExpenseDTO, Expense } from "./types";

export class ExpensesRepository {
	async create(expense: CreateExpenseDTO): Promise<Expense | undefined> {
		const [newExpense] = await db.insert(expenses).values(expense).returning();

		return newExpense;
	}

	async findById(id: string): Promise<Expense | undefined> {
		const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));

		return expense;
	}

	async findByUserId(userId: string): Promise<Expense[]> {
		return db.select().from(expenses).where(eq(expenses.userId, userId));
	}

	async findAll(): Promise<Expense[]> {
		return db.select().from(expenses);
	}

	async update(id: string, expenseData: UpdateExpenseDTO): Promise<Expense | undefined> {
		const [updatedExpense] = await db
			.update(expenses)
			.set(expenseData)
			.where(eq(expenses.id, id))
			.returning();

		return updatedExpense;
	}

	async delete(id: string): Promise<void> {
		await db.delete(expenses).where(eq(expenses.id, id));
	}
}
