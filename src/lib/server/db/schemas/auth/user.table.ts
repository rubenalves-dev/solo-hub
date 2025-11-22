import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  age: integer('age'),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull()
});

export type UserTable = typeof usersTable.$inferSelect;
