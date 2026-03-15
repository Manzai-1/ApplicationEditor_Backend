import { z } from 'zod';

export const createSessionSchema = z.object({
  token: z.string(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
