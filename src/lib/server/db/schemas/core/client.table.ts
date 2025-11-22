import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from '../auth/user.table';

export const clientsTable = sqliteTable('clients', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').references(() => usersTable.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes')
});

export type ClientsTable = typeof clientsTable.$inferSelect;
export type ClientsTableInsert = Omit<typeof clientsTable.$inferInsert, 'id' | 'ownerId'>;
export type ClientsTableUpdate = Partial<ClientsTableInsert>;
