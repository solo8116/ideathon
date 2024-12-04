// alumniAuthController.ts
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import admin from "firebase-admin";
import { CustomError } from '../utils';

const prisma = new PrismaClient();

// Sign up new alumni
export const signUpAlumni = async (req: Request, res: Response , next: NextFunction) => {
  const { uid, email, documentURL, documentPublicId, name, admissionYear, passingYear, linkedInURL, githubURL } = req.body;

  try {
    // Create new Firebase user if not already registered
    const userRecord = await admin.auth().getUser(uid);
    if (!userRecord) {
      throw new CustomError(401,"user not found")
    }

   
    const user = await prisma.user.create({
      data: {
        uid,
        name,
        admissionYear,
        passingYear,
        linkedInURL,
        githubURL,
        role: "ALUMNI",
        alumni: {
          create: {
            email,
            documentURL,
            documentPublicId,
          },
        },
      },
    });

    res.status(201).json({ message: "Alumni registered successfully", user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Log in alumni
export const loginAlumni = async (req: Request, res: Response , next: NextFunction) => {
  const { uid } = req.body;

  try {
    
    const alumni = await prisma.user.findUnique({
      where: { uid },
      include: { alumni: true },
    });

    if (!alumni) {
      throw new CustomError(401,"alumni not found")
    }

    res.status(200).json({ message: "Alumni logged in successfully", alumni });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
