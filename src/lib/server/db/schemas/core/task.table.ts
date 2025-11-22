import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from '../auth/user.table';
import { projectsTable } from './project.table';

export const tasksTable = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projectsTable.id),
  ownerId: text('owner_id').references(() => usersTable.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').$type<'todo' | 'in_progress' | 'done'>().notNull(),
  dueDate: text('due_date'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export type TasksTable = typeof tasksTable.$inferSelect;
