import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';

export const prismaErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        console.log(err);
        res.status(409).json({
          success: false,
          message: 'unique constraint violation',
        });
        break;
      case 'P2025':
      case 'P2016':
        console.log(err);
        res.status(404).json({
          success: false,
          message: 'prisma known error',
        });
        break;
      default:
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'prisma know error',
        });
        break;
    }
  } else {
    next(err);
  }
};
