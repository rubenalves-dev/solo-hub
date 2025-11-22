import { relations } from 'drizzle-orm';
import { usersTable } from './auth/user.table';
import { clientsTable } from './core/client.table';
import { projectsTable } from './core/project.table';
import { tasksTable } from './core/task.table';
import { timeEntriesTable } from './core/time-entry-table';

export const userRelations = relations(usersTable, ({ many }) => ({
  clients: many(clientsTable),
  projects: many(projectsTable),
  tasks: many(tasksTable),
  timeEntries: many(timeEntriesTable)
}));

export const clientRelations = relations(clientsTable, ({ many }) => ({
  projects: many(projectsTable)
}));

export const projectRelations = relations(projectsTable, ({ one, many }) => ({
  client: one(clientsTable, { fields: [projectsTable.clientId], references: [clientsTable.id] }),
  tasks: many(tasksTable)
}));

export const taskRelations = relations(tasksTable, ({ one, many }) => ({
  project: one(projectsTable, { fields: [tasksTable.projectId], references: [projectsTable.id] }),
  timeEntries: many(timeEntriesTable)
}));
