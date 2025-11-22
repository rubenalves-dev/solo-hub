import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
  clientsTable,
  type ClientsTable,
  type ClientsTableInsert,
  type ClientsTableUpdate
} from '../db/schemas';

export class ClientRepository {
  async getById(id: string): Promise<ClientsTable | null> {
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));
    return client || null;
  }

  async getAllByOwner(ownerId: string): Promise<ClientsTable[]> {
    return await db.select().from(clientsTable).where(eq(clientsTable.ownerId, ownerId));
  }

  async create(ownerId: string, data: ClientsTableInsert): Promise<string> {
    const id = crypto.randomUUID();
    await db.insert(clientsTable).values({
      // Spread payload first so we ensure ownerId and id can't be overwritten.
      ...data,
      ownerId: ownerId,
      id
    });
    return id;
  }

  async update(id: string, data: ClientsTableUpdate): Promise<void> {
    await db.update(clientsTable).set(data).where(eq(clientsTable.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(clientsTable).where(eq(clientsTable.id, id));
  }
}

// Singleton instance
export const clientRepository = new ClientRepository();
