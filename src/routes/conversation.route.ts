import { Router } from 'express';
import {
  deleteConversation,
  getConversationById,
  getMyConversations,
} from '../controllers';

export const conversationRouter = Router();

conversationRouter.get('/', getMyConversations);
conversationRouter.get('/:id', getConversationById);
conversationRouter.delete('/:id', deleteConversation);
