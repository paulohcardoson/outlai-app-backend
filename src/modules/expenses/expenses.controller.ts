import type { FastifyReply, FastifyRequest } from "fastify";
import { container, injectable } from "tsyringe";
import { ExpensesService } from "./expenses.service";
import type { CreateExpenseDTO } from "./types";

@injectable()
export class ExpensesController {
	constructor(
		private expensesService: ExpensesService = container.resolve(
			ExpensesService,
		),
	) { }

	async create(
		request: FastifyRequest<{ Body: CreateExpenseDTO }>,
		reply: FastifyReply,
	) {
		const expense = await this.expensesService.createExpense(request.body);

		return reply.status(201).send(expense);
	}

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const expense = await this.expensesService.getExpenseById(
			request.params.id,
		);

		return reply.status(200).send(expense);
	}

	async getByUserId(
		request: FastifyRequest<{ Params: { userId: string } }>,
		reply: FastifyReply,
	) {
		const expenses = await this.expensesService.getExpensesByUserId(
			request.params.userId,
		);

		return reply.status(200).send(expenses);
	}

	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const expenses = await this.expensesService.getAllExpenses();

		return reply.status(200).send(expenses);
	}

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: Partial<CreateExpenseDTO>;
		}>,
		reply: FastifyReply,
	) {
		const expense = await this.expensesService.updateExpense(
			request.params.id,
			request.body,
		);

		return reply.status(200).send(expense);
	}

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		await this.expensesService.deleteExpense(request.params.id);

		return reply.status(204).send();
	}
}
