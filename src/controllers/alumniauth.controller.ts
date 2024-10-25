// alumniAuthController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import admin from "firebase-admin";

const prisma = new PrismaClient();

// Sign up new alumni
export const signUpAlumni = async (req: Request, res: Response) => {
  const { uid, email, documentURL, documentPublicId, name, admissionYear, passingYear, linkedInURL, githubURL } = req.body;

  try {
    // Create new Firebase user if not already registered
    const userRecord = await admin.auth().getUser(uid);
    if (!userRecord) {
      return res.status(400).json({ message: "User not registered in Firebase." });
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
    res.status(500).json({ message: "Failed to register alumni", error });
  }
};

// Log in alumni
export const loginAlumni = async (req: Request, res: Response) => {
  const { uid } = req.body;

  try {
    
    const alumni = await prisma.user.findUnique({
      where: { uid },
      include: { alumni: true },
    });

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found." });
    }

    res.status(200).json({ message: "Alumni logged in successfully", alumni });
  } catch (error) {
    res.status(500).json({ message: "Failed to log in alumni", error });
  }
};
