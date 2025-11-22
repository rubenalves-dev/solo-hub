import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from './user.table';

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type SessionTable = typeof sessions.$inferSelect;
