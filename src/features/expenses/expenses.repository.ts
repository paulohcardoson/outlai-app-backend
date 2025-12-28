import { db } from "@config/db";
import { expenses } from "@config/db/schema";
import { and, asc, count, desc, eq, gte, lte } from "drizzle-orm";
import type { CreateExpenseDTO, Expense, GetExpensesByUserDTO, UpdateExpenseDTO } from "./types";

export class ExpensesRepository {
	async create(expense: CreateExpenseDTO): Promise<Expense> {
		const [newExpense] = await db.insert(expenses).values(expense).returning();

		return newExpense as Expense;
	}

	async findById(id: string): Promise<Expense | undefined> {
		const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));

		return expense;
	}

	async findByUserId(params: GetExpensesByUserDTO): Promise<Expense[]> {
		const {
			userId,
			page = 1,
			limit = 10,
			category,
			orderBy = "date",
			orderDirection = "desc"
		} = params;

		// Build where conditions
		const conditions = [eq(expenses.userId, userId)];
		if (category) {
			conditions.push(eq(expenses.category, category));
		}

		// Build order by clause
		const orderColumn = orderBy === "amount" ? expenses.amount : expenses.date;
		const orderFn = orderDirection === "asc" ? asc : desc;

		// Calculate offset
		const offset = (page - 1) * limit;

		return db
			.select()
			.from(expenses)
			.where(and(...conditions))
			.orderBy(orderFn(orderColumn))
			.limit(limit)
			.offset(offset);
	}

	async countByUserId(userId: string, category?: string): Promise<number> {
		const conditions = [eq(expenses.userId, userId)];
		if (category) {
			conditions.push(eq(expenses.category, category));
		}

		const result = await db
			.select({ count: count() })
			.from(expenses)
			.where(and(...conditions));

		return result[0]?.count ?? 0;
	}

	async findAll(): Promise<Expense[]> {
		return db.select().from(expenses);
	}

	async update({ id, ...expenseData }: UpdateExpenseDTO): Promise<Expense | undefined> {
		const [updatedExpense] = await db
			.update(expenses)
			.set(expenseData)
			.where(eq(expenses.id, id))
			.returning();

		return updatedExpense;
	}

	async delete(id: string, userId: string): Promise<void> {
		await db.delete(expenses).where(
			and(
				eq(expenses.id, id),
				eq(expenses.userId, userId)
			)
		);
	}

	async findByUserIdAndDateRange(userId: string, startDate: string, endDate: string): Promise<Expense[]> {
		return db.select().from(expenses).where(
			and(
				eq(expenses.userId, userId),
				gte(expenses.date, startDate),
				lte(expenses.date, endDate)
			)
		);
	}
}
