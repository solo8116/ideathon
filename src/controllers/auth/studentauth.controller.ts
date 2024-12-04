import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from '../../utils';
import { IStudentAuth } from '../../interfaces/auth';

const prisma = new PrismaClient();

export const signUpStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    uid,
    email,
    name,
    semester,
    rollNumber,
    admissionYear,
    passingYear,
    linkedInURL,
    githubURL,
  }: IStudentAuth = req.body;

  try {
    if (!email.endsWith('@kiit.ac.in')) {
      throw new CustomError(401, 'kiit email is required');
    }
    const existingUser = await prisma.user.findUnique({
      where: { uid },
    });

    if (existingUser) {
      throw new CustomError(400, 'user already exists');
    }

    await prisma.user.create({
      data: {
        uid,
        name,
        admissionYear,
        passingYear,
        linkedInURL,
        githubURL,
        role: 'STUDENT',
        student: {
          create: {
            email,
            semester,
            rollNumber,
          },
        },
      },
    });
    res
      .status(201)
      .json({ success: true, message: 'Student registered successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.user?.email;
    const student = await prisma.student.findUnique({
      where: { email },
    });
    if (!student) {
      throw new CustomError(401, 'student not found');
    }
    res
      .status(200)
      .json({ success: true, message: 'Student logged in successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
