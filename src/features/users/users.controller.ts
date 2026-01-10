import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { DeleteRequestBody, UpdateRequestBody } from "./schemas";
import type { UsersService } from "./users.service";

@injectable()
export class UsersController {
	constructor(
		@inject("UsersService")
		private usersService: UsersService,
	) {}

	async me(request: FastifyRequest, reply: FastifyReply) {
		const userId = request.userId as string;

		// Call service
		const user = await this.usersService.getUserById(userId);

		// Send response
		return reply.status(200).send({
			...user,
			password: undefined,
		});
	}

	async update(request: FastifyRequest, reply: FastifyReply) {
		const data = request.body as UpdateRequestBody;
		const userId = request.userId as string;

		// Call service
		const user = await this.usersService.updateUser({ id: userId, ...data });

		// Send response
		return reply.status(200).send(user);
	}

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const data = request.body as DeleteRequestBody;
		const userId = request.userId as string;

		// Call service
		await this.usersService.deleteUser({ id: userId, ...data });

		// Send response
		return reply.status(204).send();
	}
}
