import { UsersRepository } from "@modules/users/users.repository";
import { UsersService } from "@src/modules/users/users.service";
import { container } from "tsyringe";

// Repositories
container.registerSingleton("UsersRepository", UsersRepository);

// Services
container.registerSingleton("UsersService", UsersService);
