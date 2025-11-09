import type {
	CreateUserDTO,
	UpdateUserDTO,
	User,
} from "@src/modules/users/types";
import type { UsersRepository } from "@src/modules/users/users.repository";

export class MockUsersRepository implements UsersRepository {
	private users: User[] = [];
	private nextId = 1;

	async create(user: CreateUserDTO): Promise<User | undefined> {
		const newUser: User = {
			id: this.nextId.toString(),
			name: user.name,
			email: user.email,
			password: user.password,
			createdAt: new Date(),
		};

		this.users.push(newUser);
		this.nextId++;

		return newUser;
	}

	async findById(id: string): Promise<User | undefined> {
		return this.users.find((user) => user.id === id);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find((user) => user.email === email);
	}

	async findAll(): Promise<User[]> {
		return this.users;
	}

	async update(id: string, userData: UpdateUserDTO): Promise<User | undefined> {
		const userIndex = this.users.findIndex((user) => user.id === id);

		if (userIndex === -1) {
			return undefined;
		}

		const user = this.users[userIndex] as User;

		user.name = userData.name || user.name;
		user.email = userData.email || user.email;
		user.password = userData.password || user.password;

		this.users[userIndex] = user;

		return user;
	}

	async delete(id: string): Promise<void> {
		const userIndex = this.users.findIndex((user) => user.id === id);

		if (userIndex !== -1) {
			this.users.splice(userIndex, 1);
		}
	}
}
