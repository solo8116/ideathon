import { Router } from 'express';
import { loginAlumni, signUpAlumni } from '../../controllers';

export const alumniAuthRouter = Router();

alumniAuthRouter.post('/signup', signUpAlumni);
alumniAuthRouter.post('/login', loginAlumni);
