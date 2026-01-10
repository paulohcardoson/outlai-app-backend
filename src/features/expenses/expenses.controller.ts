import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type {
	CreateExpensesRequestBody,
	DeleteExpenseRequestParams,
	ExtractExpenseFromPhotoRequestBody,
	GetExpenseByIdRequestParams,
	GetExpensesByUserRequestQueryParams,
	UpdateExpenseRequestBody,
	UpdateExpenseRequestParams,
} from "./expenses.routes";
import type { ExpensesService } from "./expenses.service";
import type { Expense } from "./types";

@injectable()
export class ExpensesController {
	constructor(
		@inject("ExpensesService")
		private expensesService: ExpensesService,
	) {}

	/**
	 * Transform expense amount from cents (int) to dollars (float) for client
	 */
	private transformExpenseForClient(expense: Expense) {
		return {
			...expense,
			amount: expense.amount / 100,
		};
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		// Request already validated and transformed by Fastify schema
		const { description, amount, category, date } =
			request.body as CreateExpensesRequestBody;
		const userId = request.userId as string;

		// Call service (amount already in cents from schema transformation)
		const expense = await this.expensesService.createExpense({
			userId,
			description,
			amount,
			category,
			date,
		});

		// Transform and send response (convert cents back to dollars)
		return reply.status(201).send(this.transformExpenseForClient(expense));
	}

	async getByUser(request: FastifyRequest, reply: FastifyReply) {
		const userId = request.userId as string;

		// Parse query parameters
		const query = request.query as GetExpensesByUserRequestQueryParams;

		// Call service with parsed parameters
		const result = await this.expensesService.getExpensesByUser({
			userId,
			page: query?.page,
			limit: query?.limit,
			category: query?.category,
			orderBy: query?.orderBy,
			orderDirection: query?.orderDirection,
		});

		// Transform and send response (convert cents back to dollars for each expense)
		return reply.status(200).send({
			data: result.data.map((exp) => this.transformExpenseForClient(exp)),
			pagination: result.pagination,
		});
	}

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as GetExpenseByIdRequestParams;
		const userId = request.userId as string;

		// Get expense from service
		const expense = await this.expensesService.getExpenseById(id);

		// Verify ownership
		if (expense.userId !== userId) {
			return reply.status(403).send({ error: "Não autorizado" });
		}

		// Transform and send response (convert cents back to dollars)
		return reply.status(200).send(this.transformExpenseForClient(expense));
	}

	async update(request: FastifyRequest, reply: FastifyReply) {
		// Request already validated and transformed by Fastify schema
		const { id } = request.params as UpdateExpenseRequestParams;
		const data = request.body as UpdateExpenseRequestBody;

		// Ownership already verified by hook
		const updatedExpense = await this.expensesService.updateExpense({
			id,
			...data,
		});

		// Transform and send response (convert cents back to dollars)
		return reply
			.status(200)
			.send(this.transformExpenseForClient(updatedExpense));
	}

	async delete(request: FastifyRequest, reply: FastifyReply) {
		// Request already validated by Fastify schema
		const { id } = request.params as DeleteExpenseRequestParams;
		const userId = request.userId as string;

		// Ownership already verified by hook
		await this.expensesService.deleteExpense({ id, userId });

		// Send response
		return reply.status(204).send();
	}

	async getTotalsByPeriod(request: FastifyRequest, reply: FastifyReply) {
		const { startDate, endDate } = request.query as {
			startDate: string;
			endDate: string;
		};
		const userId = request.userId as string;

		// Get monthly totals
		const monthlyTotals = await this.expensesService.getTotalsByPeriod({
			userId,
			startDate,
			endDate,
		});

		// Transform amounts from cents to dollars for client
		const transformedTotals: { [key: string]: number } = {};
		for (const [month, total] of Object.entries(monthlyTotals)) {
			transformedTotals[month] = total / 100;
		}

		return reply.status(200).send(transformedTotals);
	}

	async extractExpenseFromPhoto(request: FastifyRequest, reply: FastifyReply) {
		const { uri } = request.body as ExtractExpenseFromPhotoRequestBody;

		// Call service to generate expense using AI
		const expenses = await this.expensesService.extractExpensesFromPhoto(uri);

		// Transform and send response (convert cents back to dollars)
		return reply.status(200).send(
			expenses.map((expense) => ({
				...expense,
				amount: expense.amount / 100,
			})) as typeof expenses,
		);
	}
}
