import type { CreateUserDTO, UpdateUserDTO, User } from "@src/features/users/types";

export class MockUsersRepository {
	private users: User[] = [];

	async create(user: CreateUserDTO): Promise<User | undefined> {
		const newUser: User = {
			id: crypto.randomUUID(),
			name: user.name,
			email: user.email,
			password: user.password,
			isEmailVerified: false,
			createdAt: new Date(),
		};

		this.users.push(newUser);
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

	async update({ id, ...userData }: UpdateUserDTO): Promise<User | undefined> {
		const userIndex = this.users.findIndex((user) => user.id === id);

		if (userIndex === -1) {
			return undefined;
		}

		const foundUser = this.users[userIndex] as User;

		this.users[userIndex] = {
			...foundUser,
			...userData,
		};

		return this.users[userIndex];
	}

	async delete(id: string): Promise<void> {
		this.users = this.users.filter((user) => user.id !== id);
	}

	async verifyUserEmail(id: string): Promise<void> {
		const userIndex = this.users.findIndex((user) => user.id === id);

		if (userIndex !== -1) {
			// biome-ignore lint/style/noNonNullAssertion: <It will always exist here>
			this.users[userIndex]!.isEmailVerified = true;
		}
	}

	// Helper method for tests to reset state
	reset(): void {
		this.users = [];
	}
}
