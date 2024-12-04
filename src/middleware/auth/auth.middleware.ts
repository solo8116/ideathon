// firebaseAuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../utils';
import { getAuth } from 'firebase-admin/auth';
import { firebaseProvider } from '../../libs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new CustomError(401, 'token is required');
    }
    const decodedToken = await getAuth(firebaseProvider).verifyIdToken(token);
    if (
      req.baseUrl === '/api/auth/student/signup' ||
      req.baseUrl === '/api/auth/alumni/signup'
    ) {
      req.body = {
        ...req.body,
        email: decodedToken.email,
        name: decodedToken.name,
        uid: decodedToken.uid,
        picture: decodedToken?.picture,
      };
      next();
    }
    const user = await prisma.user.findUnique({
      where: {
        uid: decodedToken.uid,
      },
    });
    if (!user) {
      throw new CustomError(401, 'user not found');
    }
    req.user = {
      id: user?.id,
      email: decodedToken.email,
      name: decodedToken.name,
      uid: decodedToken.uid,
      picture: decodedToken?.picture,
    };

    next();
  } catch (error) {
    next(error);
  }
};
