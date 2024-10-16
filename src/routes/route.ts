import { Router } from 'express';
import { groupRouter } from './group.route';
import { messageRouter } from './message.route';

export const router = Router();

router.use('/group', groupRouter);
router.use('/message', messageRouter);
