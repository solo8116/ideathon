import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import 'dotenv/config';

const CERT = process.env.PRIVATE_KEY as string;

export const firebaseProvider = initializeApp({
  credential: credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: CERT,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
});
