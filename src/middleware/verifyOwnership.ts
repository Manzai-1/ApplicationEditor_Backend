import { Request, Response, NextFunction } from 'express';
import {
  getCVOwner,
  getComponentOwner,
  getProfileOwner,
} from '@/repositories/ownershipRepository';

type ResourceType = 'cv' | 'component' | 'profile';

export const verifyOwnership = (resourceType: ResourceType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(403).json({ status: 'error', message: 'Not authorized' });
      return;
    }

    let ownerId: string | null = null;

    try {
      switch (resourceType) {
        case 'cv': {
          const cvId = req.params.cvId as string | undefined;
          if (!cvId) {
            res.status(403).json({ status: 'error', message: 'Not authorized' });
            return;
          }
          ownerId = await getCVOwner(cvId);
          break;
        }
        case 'component': {
          const componentType = req.params.componentType as string | undefined;
          const componentId = req.params.componentId as string | undefined;
          if (!componentType || !componentId) {
            res.status(403).json({ status: 'error', message: 'Not authorized' });
            return;
          }
          ownerId = await getComponentOwner(componentType, componentId);
          break;
        }
        case 'profile': {
          ownerId = await getProfileOwner(userId);
          break;
        }
      }
    } catch {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
      return;
    }

    if (!ownerId || ownerId !== userId) {
      res.status(403).json({ status: 'error', message: 'Not authorized' });
      return;
    }

    next();
  };
};
