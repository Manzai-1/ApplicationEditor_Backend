import { Request, Response } from 'express';
import * as cvRepo from '@/repositories/cv.repository';
import {
  ProfileContentInput,
  CreateCvInput,
  CreateCvFromTemplateInput,
  UpdateCvInput,
  CvIdParams,
  CreateComponentInput,
  LinkComponentInput,
  UpdateComponentInput,
  ComponentIdParams,
  CvComponentParams,
  ReorderParams,
  ReorderBodyInput,
} from '@/schemas/zodSchemas';

// Profile
export const getProfile = async (req: Request, res: Response) => {
  const profile = await cvRepo.getUserProfile(req.user!.id);
  res.json({ status: 'success', data: profile });
};

export const createProfile = async (req: Request, res: Response) => {
  const { content } = req.validated.body as ProfileContentInput;
  const id = await cvRepo.createUserProfile(req.user!.id, content);
  res.json({ status: 'success', data: { id } });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { content } = req.validated.body as ProfileContentInput;
  await cvRepo.updateUserProfile(req.user!.id, content);
  res.json({ status: 'success' });
};

// CVs
export const getCvs = async (req: Request, res: Response) => {
  const cvs = await cvRepo.getUserCvs(req.user!.id);
  res.json({ status: 'success', data: cvs });
};

export const getCv = async (req: Request, res: Response) => {
  const { cvId } = req.validated.params as CvIdParams;
  const cv = await cvRepo.getCv(cvId);
  res.json({ status: 'success', data: cv });
};

export const createCv = async (req: Request, res: Response) => {
  const { name, type } = req.validated.body as CreateCvInput;
  const id = await cvRepo.createCv(req.user!.id, name, type);
  res.json({ status: 'success', data: { id } });
};

export const createCvFromTemplate = async (req: Request, res: Response) => {
  const { templateId, name } = req.validated.body as CreateCvFromTemplateInput;
  const id = await cvRepo.createCvFromTemplate(templateId, name);
  res.json({ status: 'success', data: { id } });
};

export const updateCv = async (req: Request, res: Response) => {
  const { cvId } = req.validated.params as CvIdParams;
  const { name } = req.validated.body as UpdateCvInput;
  await cvRepo.updateCv(cvId, name);
  res.json({ status: 'success' });
};

export const deleteCv = async (req: Request, res: Response) => {
  const { cvId } = req.validated.params as CvIdParams;
  await cvRepo.deleteCv(cvId);
  res.json({ status: 'success' });
};

// Components
export const createComponent = async (req: Request, res: Response) => {
  const { cvId } = req.validated.params as CvIdParams;
  const { componentType, content } = req.validated.body as CreateComponentInput;
  const id = await cvRepo.createAndAddComponent(cvId, componentType, content);
  const sortOrder = await cvRepo.getComponentSortOrder(cvId, componentType, id);
  res.status(201).json({ status: 'success', data: { id, content, sort_order: sortOrder } });
};

export const linkComponent = async (req: Request, res: Response) => {
  const { cvId } = req.validated.params as CvIdParams;
  const { componentType, componentId } = req.validated.body as LinkComponentInput;
  await cvRepo.addComponentToCv(cvId, componentType, componentId);
  res.json({ status: 'success' });
};

export const updateComponent = async (req: Request, res: Response) => {
  const { componentType, componentId } = req.validated.params as ComponentIdParams;
  const { content } = req.validated.body as UpdateComponentInput;
  await cvRepo.updateComponent(componentType, componentId, content);
  const updated = await cvRepo.getComponentById(componentType, componentId);
  res.json({ status: 'success', data: updated });
};

export const removeComponentFromCv = async (req: Request, res: Response) => {
  const { cvId, componentType, componentId } = req.validated.params as CvComponentParams;
  await cvRepo.removeComponentFromCv(cvId, componentType, componentId);
  res.json({ status: 'success' });
};

export const deleteComponent = async (req: Request, res: Response) => {
  const { componentType, componentId } = req.validated.params as ComponentIdParams;
  await cvRepo.deleteComponent(componentType, componentId);
  res.json({ status: 'success' });
};

// Reorder
export const reorderComponents = async (req: Request, res: Response) => {
  const { cvId, componentType } = req.validated.params as ReorderParams;
  const { orderedIds } = req.validated.body as ReorderBodyInput;
  await cvRepo.reorderComponents(cvId, componentType, orderedIds);
  res.json({ status: 'success', data: { orderedIds } });
};
