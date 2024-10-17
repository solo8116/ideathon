import { Router } from 'express';
import {
  getConversationMessages,
  getGroupMessages,
  uploadFile,
} from '../controllers';
import { upload } from '../config';

export const messageRouter = Router();

messageRouter.get('/group/:id', getGroupMessages);
messageRouter.get('/conversation/:id', getConversationMessages);
messageRouter.post('/upload', upload.single('file'), uploadFile);
