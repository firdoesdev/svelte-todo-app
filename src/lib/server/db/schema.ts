import { pgTable, serial, integer, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const todo = pgTable('todo', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	completed: boolean('completed').default(false).notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
});

export * from './auth.schema';
