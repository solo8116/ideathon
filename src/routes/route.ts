import { Router } from 'express';
import { groupRouter } from './group.route';

export const router = Router();

router.use('/group', groupRouter);
