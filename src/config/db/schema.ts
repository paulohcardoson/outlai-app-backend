import {
	pgTable,
	uuid,
	varchar,
	timestamp,
	date,
	integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name").notNull(),
	email: varchar("email").notNull().unique(),
	password: varchar("password").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	description: varchar("description").notNull(),
	amount: integer("amount").notNull(),
	category: varchar("category").notNull(),
	date: date("date").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
