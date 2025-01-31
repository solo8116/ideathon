import { Router } from 'express';
import { loginStudent, signUpStudent } from '../../controllers';

export const studentAuthRouter = Router();

studentAuthRouter.post('/signup', signUpStudent);
studentAuthRouter.post('/login', loginStudent);
