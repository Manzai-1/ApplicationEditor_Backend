import { Router } from 'express';
import * as cvCtrl from '@/controllers/cv.controller';
import { validate } from '@/middleware/validate';
import { requireAuth } from '@/middleware/requireAuth';
import { catchAsyncError } from '@/utils/catchAsyncError';
import {
  profileContentSchema,
  createCvSchema,
  createCvFromTemplateSchema,
  updateCvSchema,
  cvIdParamsSchema,
  createComponentSchema,
  linkComponentSchema,
  updateComponentSchema,
  componentIdParamsSchema,
  cvComponentParamsSchema,
  reorderParamsSchema,
  reorderBodySchema,
} from '@/schemas/zodSchemas';

const router = Router();

router.use(catchAsyncError(requireAuth));

// Profile
router.get('/profile', catchAsyncError(cvCtrl.getProfile));
router.post('/profile', validate({ body: profileContentSchema }), catchAsyncError(cvCtrl.createProfile));
router.put('/profile', validate({ body: profileContentSchema }), catchAsyncError(cvCtrl.updateProfile));

// CVs
router.get('/cvs', catchAsyncError(cvCtrl.getCvs));
router.get('/cv/:cvId', validate({ params: cvIdParamsSchema }), catchAsyncError(cvCtrl.getCv));
router.post('/cv', validate({ body: createCvSchema }), catchAsyncError(cvCtrl.createCv));
router.post('/cv/from-template', validate({ body: createCvFromTemplateSchema }), catchAsyncError(cvCtrl.createCvFromTemplate));
router.put('/cv/:cvId', validate({ params: cvIdParamsSchema, body: updateCvSchema }), catchAsyncError(cvCtrl.updateCv));
router.delete('/cv/:cvId', validate({ params: cvIdParamsSchema }), catchAsyncError(cvCtrl.deleteCv));

// Components
router.post('/cv/:cvId/component', validate({ params: cvIdParamsSchema, body: createComponentSchema }), catchAsyncError(cvCtrl.createComponent));
router.post('/cv/:cvId/component/link', validate({ params: cvIdParamsSchema, body: linkComponentSchema }), catchAsyncError(cvCtrl.linkComponent));
router.put('/component/:componentType/:componentId', validate({ params: componentIdParamsSchema, body: updateComponentSchema }), catchAsyncError(cvCtrl.updateComponent));
router.delete('/cv/:cvId/component/:componentType/:componentId', validate({ params: cvComponentParamsSchema }), catchAsyncError(cvCtrl.removeComponentFromCv));
router.delete('/component/:componentType/:componentId', validate({ params: componentIdParamsSchema }), catchAsyncError(cvCtrl.deleteComponent));

// Reorder
router.put('/cv/:cvId/reorder/:componentType', validate({ params: reorderParamsSchema, body: reorderBodySchema }), catchAsyncError(cvCtrl.reorderComponents));

export default router;
