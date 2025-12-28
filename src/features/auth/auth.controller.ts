import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { schemas } from "./auth.routes";
import type { AuthService } from "./auth.service";

@injectable()
export class AuthController {
  constructor(
    @inject("AuthService")
    private authService: AuthService,
  ) { }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = schemas.login.body.parse(request.body);

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
    const data = schemas.register.body.parse(request.body);

    // Call service
    await this.authService.register(data);

    // Send response
    return reply.status(200).send();
  }

  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    const { token, "user-id": userId } = schemas.verifyEmail.querystring.parse(request.query);

    // Call service
    await this.authService.verifyEmail({ userId, token });

    // Send response
    return reply.status(200).send();
  }

  async resendEmailVerification(request: FastifyRequest, reply: FastifyReply) {
    const { email } = schemas.resendEmailVerification.body.parse(request.body);

    // Call service
    await this.authService.resendEmailVerification(email);

    return reply.status(200).send();
  }
}
