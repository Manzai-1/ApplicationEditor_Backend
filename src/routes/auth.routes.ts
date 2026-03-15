import { Router } from 'express';
import { createSession } from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate';
import { createSessionSchema } from '@/schemas/zodSchemas';
import { catchAsyncError } from '@/utils/catchAsyncError';

const router = Router();

router.post('/session', validate({ body: createSessionSchema }), catchAsyncError(createSession));

export default router;
