export class AppError extends Error {
	public code: number;

	constructor(message: string = "Ocorreu um erro.", code: number = 400) {
		super(message);
		this.code = code;
	}
}
