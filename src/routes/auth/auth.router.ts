import { Router } from 'express';
import { studentAuthRouter } from './studentAuth.router';
import { alumniAuthRouter } from './alumniAuth.router';

export const authRouter = Router();

authRouter.use('/student', studentAuthRouter);
authRouter.use('/alumni', alumniAuthRouter);
