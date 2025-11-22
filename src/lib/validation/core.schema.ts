import z from 'zod';

export const idStringSchema = z.object({
  id: z.string().min(1)
});

export const idIntSchema = z.object({
  id: z.number().min(1)
});

export type IdStringSchema = typeof idStringSchema;
export type IdIntSchema = typeof idIntSchema;
