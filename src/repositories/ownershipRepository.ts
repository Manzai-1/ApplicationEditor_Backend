import { supabase } from '@/config/supabase';

type ComponentTable =
  | 'abouts'
  | 'skills'
  | 'languages'
  | 'experiences'
  | 'education'
  | 'certifications';

const componentTables: Record<string, ComponentTable> = {
  about: 'abouts',
  skill: 'skills',
  language: 'languages',
  experience: 'experiences',
  education: 'education',
  certification: 'certifications',
};

export const getCVOwner = async (cvId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('cvs')
    .select('user_id')
    .eq('id', cvId)
    .single();

  if (error || !data) return null;
  return data.user_id;
};

export const getComponentOwner = async (
  type: string,
  id: string
): Promise<string | null> => {
  const table = componentTables[type];
  if (!table) return null;

  const { data, error } = await supabase
    .from(table)
    .select('user_id')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data.user_id;
};

export const getProfileOwner = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data.user_id;
};
