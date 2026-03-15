import { Request, Response } from 'express';
import { verifyToken } from '@/repositories/auth.repository';
import { CreateSessionInput } from '@/schemas/zodSchemas';
import { env } from '@/config/env';
import { AppError } from '@/utils/AppError';

export const createSession = async (req: Request, res: Response) => {
  const { accessToken } = req.validated.body as CreateSessionInput;

  const user = await verifyToken(accessToken);

  res.cookie('session', accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user });
};

export const getMe = async (req: Request, res: Response) => {
  const token = req.cookies.session;

  if (!token) {
    throw new AppError('Not authenticated', 401);
  }

  const user = await verifyToken(token);

  res.json({ status: 'success', data: { user } });
};
