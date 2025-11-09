import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { CreateUserDTO } from "./types";
import type { UsersService } from "./users.service";

@injectable()
export class UsersController {
	constructor(
		@inject("UsersService")
		private usersService: UsersService,
	) {}

	async create(
		request: FastifyRequest<{ Body: CreateUserDTO }>,
		reply: FastifyReply,
	) {
		const user = await this.usersService.createUser(request.body);

		return reply.status(201).send(user);
	}

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: Partial<CreateUserDTO>;
		}>,
		reply: FastifyReply,
	) {
		const user = await this.usersService.updateUser(
			request.params.id,
			request.body,
		);

		return reply.status(200).send(user);
	}

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		await this.usersService.deleteUser(request.params.id);

		return reply.status(204).send();
	}
}
