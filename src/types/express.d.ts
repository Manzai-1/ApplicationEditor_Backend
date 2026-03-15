import { z } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: z.infer<z.ZodTypeAny>;
        query?: z.infer<z.ZodTypeAny>;
        params?: z.infer<z.ZodTypeAny>;
      };
    }
  }
}

export {};
