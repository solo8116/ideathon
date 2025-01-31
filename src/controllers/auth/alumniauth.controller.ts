import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError, uploader } from '../../utils';
import { IAlumniAuth } from '../../interfaces/auth';

const prisma = new PrismaClient();

export const signUpAlumni = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      uid,
      email,
      name,
      admissionYear,
      passingYear,
      linkedInURL,
      githubURL,
    }: IAlumniAuth = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        uid,
      },
    });
    if (existingUser) {
      throw new CustomError(400, 'user already exists');
    }
    if (!req.file) {
      throw new CustomError(400, 'document is required');
    }
    const result = await uploader(req.file);
    await prisma.user.create({
      data: {
        uid,
        name,
        admissionYear,
        passingYear,
        linkedInURL,
        githubURL,
        role: 'ALUMNI',
        alumni: {
          create: {
            email,
            documentURL: result.secure_url,
            documentPublicId: result.public_id,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Alumni registered successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginAlumni = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.user?.email;
    const alumni = await prisma.alumni.findUnique({
      where: { email },
    });
    if (!alumni) {
      throw new CustomError(401, 'alumni not found');
    }
    res
      .status(200)
      .json({ success: true, message: 'Alumni logged in successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
