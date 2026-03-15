import { Request, Response } from 'express';
import { verifyToken } from '@/repositories/auth.repository';
import { CreateSessionInput } from '@/schemas/zodSchemas';
import { env } from '@/config/env';

export const createSession = async (req: Request, res: Response) => {
  const { token } = req.validated.body as CreateSessionInput;

  const user = await verifyToken(token);

  res.cookie('session', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user });
};
