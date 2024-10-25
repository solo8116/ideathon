// studentAuthController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import admin from "firebase-admin";

const prisma = new PrismaClient();

// Sign up new student
export const signUpStudent = async (req: Request, res: Response) => {
  const { uid, email, name, semester, rollNumber, admissionYear, passingYear, linkedInURL, githubURL } = req.body;

  try {
    // Check if the student is already registered
    const existingUser = await prisma.user.findUnique({
      where: { uid },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Student is already registered." });
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

    res.status(201).json({ message: "Student registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to register student", error });
  }
};

// Log in student
export const loginStudent = async (req: Request, res: Response) => {
  const { uid } = req.body;

  try {
    // Find existing student by UID
    const student = await prisma.user.findUnique({
      where: { uid },
      include: { student: true },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json({ message: "Student logged in successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Failed to log in student", error });
  }
};
