// studentAuthController.ts
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { CustomError } from '../utils';
// import admin from "firebase-admin";

const prisma = new PrismaClient();

// Sign up new student
export const signUpStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { uid, email, name, semester, rollNumber, admissionYear, passingYear, linkedInURL, githubURL } = req.body;

  try {
    // Check if the student is already registered
    const existingUser = await prisma.user.findUnique({
      where: { uid },
    });

    if (existingUser) {
      throw new CustomError(401,"user exists")
    }

    // Create new User and Student records
    const user = await prisma.user.create({
      data: {
        uid,
        name,
        admissionYear,
        passingYear,
        linkedInURL,
        githubURL,
        role: "STUDENT",
        student: {
          create: {
            email,
            semester,
            rollNumber,
          },
        },
      },
    });
    console.log(user)
    res.status(201).json({ message: "Student registered successfully", user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Log in student
export const loginStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.body;

  try {
    // Find existing student by UID
    const student = await prisma.user.findUnique({
      where: { uid },
      include: { student: true },
    });

    if (!student) {
      throw new CustomError(401,"student not found")
    }

    res.status(200).json({ message: "Student logged in successfully", student });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
