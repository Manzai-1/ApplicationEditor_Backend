import { Router } from 'express';
import { createSession, getMe, logout } from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate';
import { createSessionSchema } from '@/schemas/zodSchemas';
import { catchAsyncError } from '@/utils/catchAsyncError';

const router = Router();

router.post('/session', validate({ body: createSessionSchema }), catchAsyncError(createSession));
router.get('/me', catchAsyncError(getMe));
router.post('/logout', catchAsyncError(logout));

export default router;
