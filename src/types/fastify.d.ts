import "fastify";

declare module "fastify" {
	interface Session {
		authenticated?: boolean;
		userId?: string;
	}
}
