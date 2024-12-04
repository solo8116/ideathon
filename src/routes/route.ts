import { Router } from 'express';
import { groupRouter } from './group.route';
import { messageRouter } from './message.route';
import { conversationRouter } from './conversation.route';
import { authMiddleware } from '../middleware';
import { authRouter } from './auth';

export const router = Router();

router.use(authMiddleware);
router.use('/auth', authRouter);
router.use('/group', groupRouter);
router.use('/message', messageRouter);
router.use('/conversation', conversationRouter);
