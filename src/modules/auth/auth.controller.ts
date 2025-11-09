import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { AuthService } from "./auth.service";
import type { LoginDTO, RegisterDTO } from "./types";

@injectable()
export class AuthController {
	constructor(
		@inject("AuthService")
		private authService: AuthService,
	) {}

	async login(
		request: FastifyRequest<{ Body: LoginDTO }>,
		reply: FastifyReply,
	) {
		const result = await this.authService.login(request.body);

		return reply.status(200).send(result);
	}

	async register(
		request: FastifyRequest<{ Body: RegisterDTO }>,
		reply: FastifyReply,
	) {
		const result = await this.authService.register(request.body);

		return reply.status(201).send(result);
	}
}
