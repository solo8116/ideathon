// firebaseAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Shared middleware for verifying Firebase ID tokens
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ message: "Unauthorized access: Token missing." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.body.uid = decodedToken.uid; // Attach UID to the request for further use
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized access: Invalid token." });
  }
};
