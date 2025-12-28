import { AppError } from "@shared/errors/AppError";
import { categories } from "@src/shared/consts/categories";
import type { AIServiceProvider } from "@src/shared/providers/ai/interface/AIServiceProvider";
import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";
import type { ExpensesRepository } from "./expenses.repository";
import type { CreateExpensesRequestBody } from "./expenses.routes";
import type { CreateExpenseDTO, DeleteExpenseDTO, Expense, ExtractExpenseFromPhotoDTO, GetExpensesByUserDTO, GetTotalsByPeriodDTO, MonthlyTotals, PaginatedExpensesResponse, UpdateExpenseDTO } from "./types";

@injectable()
export class ExpensesService {
  constructor(
    @inject("ExpensesRepository")
    private expensesRepository: ExpensesRepository,

    @inject("AIServiceProvider")
    private aiServiceProvider: AIServiceProvider,
  ) { }

  async createExpense(data: CreateExpenseDTO): Promise<Expense> {
    const expense = await this.expensesRepository.create(data);

    if (!expense) {
      throw new AppError("Erro ao criar despesa", 500);
    }

    return expense;
  }

  async getExpenseById(id: string): Promise<Expense> {
    const expense = await this.expensesRepository.findById(id);

    if (!expense) {
      throw new AppError("Despesa não encontrada", 404);
    }

    return expense;
  }

  async getExpensesByUser(data: GetExpensesByUserDTO): Promise<PaginatedExpensesResponse> {
    const { userId, page = 1, limit = 10, category } = data;

    // Get expenses with pagination and filtering
    const expenses = await this.expensesRepository.findByUserId(data);

    // Get total count for pagination
    const total = await this.expensesRepository.countByUserId(userId, category);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getAllExpenses(): Promise<Expense[]> {
    return this.expensesRepository.findAll();
  }

  async updateExpense(data: UpdateExpenseDTO): Promise<Expense> {
    const expense = await this.expensesRepository.findById(data.id);

    if (!expense) {
      throw new AppError("Despesa não encontrada", 404);
    }

    const updatedExpense = await this.expensesRepository.update(data);

    if (!updatedExpense) {
      throw new AppError("Erro ao atualizar despesa", 500);
    }

    return updatedExpense;
  }

  async deleteExpense(data: DeleteExpenseDTO): Promise<void> {
    const expense = await this.expensesRepository.findById(data.id);

    if (!expense) {
      throw new AppError("Despesa não encontrada", 404);
    }

    if (expense.userId !== data.userId) {
      throw new AppError("Não autorizado a deletar esta despesa", 403);
    }

    await this.expensesRepository.delete(data.id, data.userId);
  }

  async getTotalsByPeriod(data: GetTotalsByPeriodDTO): Promise<MonthlyTotals> {
    const { userId, startDate, endDate } = data;

    // Validate dates
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      throw new AppError("Datas inválidas", 400);
    }

    if (end.isBefore(start)) {
      throw new AppError("Data final deve ser posterior à data inicial", 400);
    }

    // Get all expenses within the date range
    const expenses = await this.expensesRepository.findByUserIdAndDateRange(userId, startDate, endDate);

    // Group expenses by month and calculate totals
    const monthlyTotals: MonthlyTotals = {};

    for (const expense of expenses) {
      // Parse expense date using day.js
      const expenseDate = dayjs(expense.date);
      // Format month key as MM/YYYY
      const monthKey = expenseDate.format('MM/YYYY');

      // Initialize month total if not exists
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }

      // Add expense amount to month total
      monthlyTotals[monthKey] += expense.amount;
    }

    return monthlyTotals;
  }

  async extractExpensesFromPhoto(data: ExtractExpenseFromPhotoDTO): Promise<CreateExpensesRequestBody[]> {
    const prompt =
      `Identifique se essa imagem é um recibo ou fatura. Caso não seja, responda com apenas o texto "error".
      Responda com array de despesas, cada despesa tendo os campos: description (string), amount (inteiro com centavos), category (string), date (string no formato YYYY-MM-DD).
      Caso todas as despesas sejam da mesma categoria, resuma todas as despesas em uma única despesa, somando os valores e resumindo sua descrição.
      Caso não hava uma data explícita, utilize a data atual.
      Utilize as categorias pré-definidas: ${categories.join(", ")}. Se nenhuma categoria se aplicar, utilize "Outros".
      Não use markdowns nessa resposta.
      A resposta deve ser um array JSON válido.
      `;
    const aiResponse = await this.aiServiceProvider.askAboutImage(prompt, data);

    if (!aiResponse || aiResponse === "error") {
      throw new AppError("Não foi possível extrair despesas da imagem fornecida.", 400);
    }

    const expenses = JSON.parse(aiResponse) as CreateExpensesRequestBody[];

    return expenses;
  }
}
