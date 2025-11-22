import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from '../auth/user.table';
import { clientsTable } from './client.table';

export const projectsTable = sqliteTable('projects', {
  id: text('id').primaryKey(),
  clientId: text('client_id').references(() => clientsTable.id),
  ownerId: text('owner_id').references(() => usersTable.id),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  status: text('status').$type<'not_started' | 'in_progress' | 'completed' | 'on_hold'>().notNull(),

  repoUrl: text('repo_url'),
  liveUrl: text('live_url'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export type ProjectsTable = typeof projectsTable.$inferSelect;
