import type { CreateExpenseDTO, Expense, UpdateExpenseDTO } from "@src/features/expenses/types";

export class MockExpensesRepository {
	private expenses: Expense[] = [];

	async create(expense: CreateExpenseDTO): Promise<Expense | undefined> {
		const newExpense: Expense = {
			id: crypto.randomUUID(),
			userId: expense.userId,
			description: expense.description,
			amount: expense.amount,
			category: expense.category,
			date: expense.date,
			createdAt: new Date(),
		};

		this.expenses.push(newExpense);
		return newExpense;
	}

	async findById(id: string): Promise<Expense | undefined> {
		return this.expenses.find((expense) => expense.id === id);
	}

	async findByUserId(userId: string): Promise<Expense[]> {
		return this.expenses.filter((expense) => expense.userId === userId);
	}

	async findAll(): Promise<Expense[]> {
		return this.expenses;
	}

	async update({ id, ...expenseData }: UpdateExpenseDTO): Promise<Expense | undefined> {
		const expenseIndex = this.expenses.findIndex((expense) => expense.id === id);

		if (expenseIndex === -1) {
			return undefined;
		}

		this.expenses[expenseIndex] = {
			...this.expenses[expenseIndex] as Expense,
			...expenseData,
		};

		return this.expenses[expenseIndex];
	}

	async delete(id: string, userId: string): Promise<void> {
		this.expenses = this.expenses.filter(
			(expense) => !(expense.id === id && expense.userId === userId)
		);
	}

	// Helper method for tests to reset state
	reset(): void {
		this.expenses = [];
	}
}
