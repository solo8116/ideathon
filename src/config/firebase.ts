// firebase.ts
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Import your service account key JSON file
import serviceAccount from "./serviceAccountKey.json"; 

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.DATABASE_URL // Update with your project ID
  });
}

export default admin;
