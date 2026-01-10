import { AppError } from "@src/shared/errors/AppError";
import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { AuthService } from "./auth.service";
import type {
	LoginRequestBody,
	RegisterRequestBody,
	ResendEmailVerificationRequestBody,
	VerifyEmailRequestQuery,
} from "./schemas";

@injectable()
export class AuthController {
	constructor(
		@inject("AuthService")
		private authService: AuthService,
	) {}

	async login(request: FastifyRequest, reply: FastifyReply) {
		const data = request.body as LoginRequestBody;

		// Call service (JWT generation happens in service)
		const loginResponse = await this.authService.login(data);

		// Set HTTP Only cookie with the token
		reply.setCookie("Authorization", loginResponse.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 5 * 24 * 60 * 60, // 5 days (matching JWT expiration)
		});

		// Send response with JWT token
		return reply.status(200).send(loginResponse);
	}

	async register(request: FastifyRequest, reply: FastifyReply) {
		const data = request.body as RegisterRequestBody;

		// Call service
		await this.authService.register(data);

		// Send response
		return reply.status(200).send();
	}

	async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
		const { token, "user-id": userId } =
			request.query as VerifyEmailRequestQuery;

		try {
			await this.authService.verifyEmail({ userId, token });

			return reply.status(200).send("Email successfully verified.");
		} catch (error) {
			if (error instanceof AppError) {
				return reply.status(error.code as number).send(error.message);
			}

			return reply.status(400).send("Invalid or expired verification link.");
		}
	}

	async resendEmailVerification(request: FastifyRequest, reply: FastifyReply) {
		const { email } = request.body as ResendEmailVerificationRequestBody;

		// Call service
		await this.authService.resendEmailVerification(email);

		return reply.status(200).send();
	}
}
