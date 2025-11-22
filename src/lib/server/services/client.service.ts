import type {
  ServiceCreate,
  ServiceDelete,
  ServiceGet,
  ServiceList,
  ServiceUpdate
} from '$lib/types/services';
import { upsertClientSchema } from '$lib/validation/client.schema';
import type { ClientsTable } from '../db/schemas';
import { clientRepository } from '../repositories/client.repository';

export class ClientService {
  async getAll(ownerId: string): Promise<ServiceList<ClientsTable>> {
    const clients = await clientRepository.getAllByOwner(ownerId);
    return {
      items: clients,
      total: clients.length
    };
  }

  async get(id: string, ownerId: string): Promise<ServiceGet<ClientsTable>> {
    const client = await clientRepository.getById(id);
    if (client?.ownerId !== ownerId) {
      return null;
    }
    return client;
  }

  async create(ownerId: string, data: unknown): Promise<ServiceCreate<ClientsTable>> {
    const parsed = upsertClientSchema.safeParse(data);

    if (!parsed.success) {
      throw parsed.error;
    }

    const id = await clientRepository.create(ownerId, parsed.data);
    const client = await clientRepository.getById(id);
    return client;
  }

  async update(id: string, ownerId: string, data: unknown): Promise<ServiceUpdate<ClientsTable>> {
    const client = await clientRepository.getById(id);
    if (client?.ownerId !== ownerId) {
      throw new Error('Client not found or access denied');
    }

    const parsed = upsertClientSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Validation error updating client:', parsed.error);
      throw parsed.error;
    }

    console.log('Updating client with data:', parsed.data);
    await clientRepository.update(id, parsed.data);
    const updatedClient = await clientRepository.getById(id);
    return updatedClient;
  }

  async delete(id: string, ownerId: string): Promise<ServiceDelete> {
    const client = await clientRepository.getById(id);
    if (client?.ownerId !== ownerId) {
      throw new Error('Client not found or access denied');
    }
    await clientRepository.delete(id);
    return { deleted: true };
  }
}

export const clientService = new ClientService();
