import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/repositories/auth.repository';
import { AppError } from '@/utils/AppError';

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies.session;

  if (!token) {
    throw new AppError('Not authenticated', 401);
  }

  const user = await verifyToken(token);

  req.user = {
    id: user.id,
    email: user.email!,
  };

  next();
};
