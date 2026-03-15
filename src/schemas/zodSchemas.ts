import { z } from 'zod';

// Auth
export const createSessionSchema = z.object({
  accessToken: z.string(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// Common
const componentTypeSchema = z.enum([
  'about',
  'skill',
  'language',
  'experience',
  'education',
  'certification',
]);

const cvIdParamsSchema = z.object({
  cvId: z.string().uuid(),
});

const componentIdParamsSchema = z.object({
  componentType: componentTypeSchema,
  componentId: z.string().uuid(),
});

const cvComponentParamsSchema = z.object({
  cvId: z.string().uuid(),
  componentType: componentTypeSchema,
  componentId: z.string().uuid(),
});

// Profile
export const profileContentSchema = z.object({
  content: z.record(z.string(), z.unknown()),
});

export type ProfileContentInput = z.infer<typeof profileContentSchema>;

// CV
export const createCvSchema = z.object({
  name: z.string().min(1),
  type: z.number().int().min(0).max(1),
});

export type CreateCvInput = z.infer<typeof createCvSchema>;

export const createCvFromTemplateSchema = z.object({
  name: z.string().min(1),
  templateId: z.string().uuid(),
});

export type CreateCvFromTemplateInput = z.infer<typeof createCvFromTemplateSchema>;

export const updateCvSchema = z.object({
  name: z.string().min(1),
});

export type UpdateCvInput = z.infer<typeof updateCvSchema>;

export { cvIdParamsSchema };
export type CvIdParams = z.infer<typeof cvIdParamsSchema>;

// Components
export const createComponentSchema = z.object({
  componentType: componentTypeSchema,
  content: z.record(z.string(), z.unknown()),
});

export type CreateComponentInput = z.infer<typeof createComponentSchema>;

export const linkComponentSchema = z.object({
  componentType: componentTypeSchema,
  componentId: z.string().uuid(),
});

export type LinkComponentInput = z.infer<typeof linkComponentSchema>;

export const updateComponentSchema = z.object({
  content: z.record(z.string(), z.unknown()),
});

export type UpdateComponentInput = z.infer<typeof updateComponentSchema>;

export { componentIdParamsSchema };
export type ComponentIdParams = z.infer<typeof componentIdParamsSchema>;

export { cvComponentParamsSchema };
export type CvComponentParams = z.infer<typeof cvComponentParamsSchema>;

// Reorder
export const reorderParamsSchema = z.object({
  cvId: z.string().uuid(),
  componentType: componentTypeSchema,
});

export type ReorderParams = z.infer<typeof reorderParamsSchema>;

export const reorderBodySchema = z.object({
  orderedIds: z.array(z.string().uuid()),
});

export type ReorderBodyInput = z.infer<typeof reorderBodySchema>;
