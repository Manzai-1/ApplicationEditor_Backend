import { supabaseAdmin } from '@/config/supabase';
import { AppError } from '@/utils/AppError';

export const verifyToken = async (token: string) => {
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    throw new AppError('Invalid token', 401);
  }

  return data.user;
};
