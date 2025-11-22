import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100)
})

export const signupSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
  age: z.number().min(13).max(120).optional()
})

export type LoginSchema = typeof loginSchema;
export type SignupSchema = typeof signupSchema;
