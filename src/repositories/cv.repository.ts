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
