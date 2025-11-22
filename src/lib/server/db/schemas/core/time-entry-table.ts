import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from '../auth/user.table';
import { tasksTable } from './task.table';

export const timeEntriesTable = sqliteTable('time_entries', {
  id: text('id').primaryKey(),
  taskId: text('task_id').references(() => tasksTable.id),
  userId: text('user_id').references(() => usersTable.id),
  description: text('description'),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull()
});

export type TimeEntriesTable = typeof timeEntriesTable.$inferSelect;
