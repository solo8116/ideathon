// firebaseAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { CustomError } from "../../utils";

// Shared middleware for verifying Firebase ID tokens
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
 
  try {
    const idToken = req.headers.authorization?.split(' ')[1];
    if (!idToken) {
      throw new CustomError(401,"id token not found")
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.body.uid = decodedToken.uid; 
    if (!decodedToken.email?.endsWith('@kiit.ac.in')) {
      throw new CustomError(401,"kiit email allowed")
    }
    
    next();
  } catch (error) {
    next(error);
  }
};


