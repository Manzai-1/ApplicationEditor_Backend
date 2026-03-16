import { supabase } from '@/config/supabase';
import { AppError } from '@/utils/AppError';
import { Profile, CV, CVMeta } from '@/types/entities';
import { Json } from '@/types/database';

// Profile
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase.rpc('get_user_profile', { p_user_id: userId });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data as Profile | null;
};

export const createUserProfile = async (userId: string, content: Record<string, unknown>): Promise<string> => {
  const { data, error } = await supabase.rpc('create_user_profile', {
    p_user_id: userId,
    p_content: content as Json,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data as string;
};

export const updateUserProfile = async (userId: string, content: Record<string, unknown>): Promise<void> => {
  const { error } = await supabase.rpc('update_user_profile', {
    p_user_id: userId,
    p_content: content as Json,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

// CVs
export const getUserCvs = async (userId: string): Promise<CVMeta[]> => {
  const { data, error } = await supabase.rpc('get_user_cvs', { p_user_id: userId });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (data as CVMeta[]) || [];
};

export const getCv = async (cvId: string): Promise<CV | null> => {
  const { data, error } = await supabase.rpc('get_cv', { p_cv_id: cvId });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data as CV | null;
};

export const createCv = async (userId: string, name: string, type: number): Promise<string> => {
  const { data, error } = await supabase.rpc('create_cv', {
    p_user_id: userId,
    p_name: name,
    p_type: type,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data as string;
};

export const createCvFromTemplate = async (templateId: string, name: string): Promise<string> => {
  const { data, error } = await supabase.rpc('create_cv_from_template', {
    p_template_id: templateId,
    p_name: name,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data as string;
};

export const updateCv = async (cvId: string, name: string): Promise<void> => {
  const { error } = await supabase.rpc('update_cv', {
    p_cv_id: cvId,
    p_name: name,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

export const deleteCv = async (cvId: string): Promise<void> => {
  const { error } = await supabase.rpc('delete_cv', { p_cv_id: cvId });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

// Components
export const createAndAddComponent = async (
  cvId: string,
  componentType: string,
  content: Record<string, unknown>
): Promise<string> => {
  const { data, error } = await supabase.rpc('create_and_add_component', {
    p_cv_id: cvId,
    p_component_type: componentType,
    p_content: content as Json,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data as string;
};

export const addComponentToCv = async (cvId: string, componentType: string, componentId: string): Promise<void> => {
  const { error } = await supabase.rpc('add_component_to_cv', {
    p_cv_id: cvId,
    p_component_type: componentType,
    p_component_id: componentId,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

export const updateComponent = async (
  componentType: string,
  componentId: string,
  content: Record<string, unknown>
): Promise<void> => {
  const { error } = await supabase.rpc('update_component', {
    p_component_type: componentType,
    p_component_id: componentId,
    p_content: content as Json,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

export const removeComponentFromCv = async (
  cvId: string,
  componentType: string,
  componentId: string
): Promise<void> => {
  const { error } = await supabase.rpc('remove_component_from_cv', {
    p_cv_id: cvId,
    p_component_type: componentType,
    p_component_id: componentId,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

export const deleteComponent = async (componentType: string, componentId: string): Promise<void> => {
  const { error } = await supabase.rpc('delete_component', {
    p_component_type: componentType,
    p_component_id: componentId,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

// Reorder
export const reorderComponents = async (
  cvId: string,
  componentType: string,
  orderedIds: string[]
): Promise<void> => {
  const { error } = await supabase.rpc('reorder_components', {
    p_cv_id: cvId,
    p_component_type: componentType,
    p_ordered_ids: orderedIds,
  });

  if (error) {
    throw new AppError(error.message, 500);
  }
};

// Component queries
const componentTableMap: Record<string, string> = {
  about: 'abouts',
  skill: 'skills',
  language: 'languages',
  experience: 'experiences',
  education: 'education',
  certification: 'certifications',
};

const junctionTableMap: Record<string, { table: string; fk: string }> = {
  about: { table: 'cv_abouts', fk: 'about_id' },
  skill: { table: 'cv_skills', fk: 'skill_id' },
  language: { table: 'cv_languages', fk: 'language_id' },
  experience: { table: 'cv_experiences', fk: 'experience_id' },
  education: { table: 'cv_education', fk: 'education_id' },
  certification: { table: 'cv_certifications', fk: 'certification_id' },
};

export const getComponentById = async (
  componentType: string,
  componentId: string
): Promise<{ id: string; content: Record<string, unknown> } | null> => {
  const tableName = componentTableMap[componentType];
  if (!tableName) {
    throw new AppError(`Invalid component type: ${componentType}`, 400);
  }

  const { data, error } = await supabase
    .from(tableName as 'abouts')
    .select('id, content')
    .eq('id', componentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new AppError(error.message, 500);
  }

  return { id: data.id, content: data.content as Record<string, unknown> };
};

export const getComponentSortOrder = async (
  cvId: string,
  componentType: string,
  componentId: string
): Promise<number | null> => {
  const junction = junctionTableMap[componentType];
  if (!junction) {
    throw new AppError(`Invalid component type: ${componentType}`, 400);
  }

  const { data, error } = await supabase
    .from(junction.table as 'cv_abouts')
    .select('sort_order')
    .eq('cv_id', cvId)
    .eq(junction.fk as 'about_id', componentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new AppError(error.message, 500);
  }

  return data.sort_order;
};
