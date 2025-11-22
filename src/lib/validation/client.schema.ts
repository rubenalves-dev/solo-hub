import z from 'zod';

export const upsertClientSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).max(120),
  email: z.email().max(255),
  phone: z.string().max(20).nullable(),
  address: z.string().max(255).nullable(),
  notes: z.string().max(1000).nullable()
});

export type UpsertClientSchema = typeof upsertClientSchema;
