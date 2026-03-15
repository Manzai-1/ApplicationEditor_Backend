import { z } from 'zod';

export const createSessionSchema = z.object({
  accessToken: z.string(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
