import { AppError } from "@src/shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import type { CreateExpenseDTO, UpdateExpenseDTO, Expense } from "./types";
import type { ExpensesRepository } from "./expenses.repository";

@injectable()
export class ExpensesService {
	constructor(
		@inject("ExpensesRepository")
		private expensesRepository: ExpensesRepository,
	) {}

	async createExpense(expenseData: CreateExpenseDTO): Promise<Expense | undefined> {
		return this.expensesRepository.create(expenseData);
	}

	async getExpenseById(id: string): Promise<Expense> {
		const expense = await this.expensesRepository.findById(id);

		if (!expense) {
			throw new AppError("Despesa não encontrada", 404);
		}

		return expense;
	}

	async getExpensesByUserId(userId: string): Promise<Expense[]> {
		return this.expensesRepository.findByUserId(userId);
	}

	async getAllExpenses(): Promise<Expense[]> {
		return this.expensesRepository.findAll();
	}

	async updateExpense(
		id: string,
		expenseData: Partial<UpdateExpenseDTO>,
	): Promise<Expense> {
		const updatedExpense = await this.expensesRepository.update(id, expenseData);

		if (!updatedExpense) {
			throw new AppError("Despesa não encontrada", 404);
		}

		return updatedExpense;
	}

	async deleteExpense(id: string): Promise<void> {
		const expense = await this.expensesRepository.findById(id);

		if (!expense) {
			throw new AppError("Despesa não encontrada", 404);
		}

		await this.expensesRepository.delete(id);
	}
}
