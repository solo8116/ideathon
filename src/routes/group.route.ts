import { Router } from 'express';
import {
  addMember,
  createGroup,
  getGroupById,
  getMyGroups,
  leaveGroup,
  removeMember,
} from '../controllers';

export const groupRouter = Router();

groupRouter.get('/', getMyGroups);
groupRouter.get('/:id', getGroupById);
groupRouter.post('/', createGroup);
groupRouter.patch('/:id/member', addMember);
groupRouter.delete('/:id/member', removeMember);
groupRouter.delete('/:id', leaveGroup);
