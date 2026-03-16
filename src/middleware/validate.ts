import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidationSchemas {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validated = req.validated || {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        next(result.error);
        return;
      }
      req.validated.body = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        next(result.error);
        return;
      }
      req.validated.query = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        next(result.error);
        return;
      }
      req.validated.params = result.data;
    }

    next();
  };
};
