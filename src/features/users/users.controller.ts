import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { schemas } from "./users.routes";
import type { UsersService } from "./users.service";

@injectable()
export class UsersController {
  constructor(
    @inject("UsersService")
    private usersService: UsersService,
  ) { }


  async me(request: FastifyRequest, reply: FastifyReply) {
    // biome-ignore lint/style/noNonNullAssertion: <Already verified in requireAuth>
    const userId = request.userId!;

    // Call service
    const user = await this.usersService.getUserById(userId);

    // Send response
    return reply.status(200).send({
      ...user,
      password: undefined,
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const data = schemas.update.body.parse(request.body);
    // biome-ignore lint/style/noNonNullAssertion: <Already verified in requireAuth>
    const userId = request.userId!;

    // Call service
    const user = await this.usersService.updateUser({ id: userId, ...data });

    // Send response
    return reply.status(200).send(user);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const data = schemas.delete.body.parse(request.body);
    // biome-ignore lint/style/noNonNullAssertion: <Already verified in requireAuth>
    const userId = request.userId!;

    // Call service
    await this.usersService.deleteUser({ id: userId, ...data });

    // Send response
    return reply.status(204).send();
  }
}
