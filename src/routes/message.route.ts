import { Router } from 'express';
import { getConversationMessages, getGroupMessages } from '../controllers';

export const messageRouter = Router();

messageRouter.get('/group/:id', getGroupMessages);
messageRouter.get('/conversation/:id', getConversationMessages);
