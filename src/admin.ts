import admin from "firebase-admin";
import serviceAccount from "../config/ServiceAccountKey.json";
import dotenv from 'dotenv';

dotenv.config();

// Ensure the serviceAccount object matches the expected type
const serviceAccountConfig = serviceAccount as admin.ServiceAccount;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL 
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

const auth:any = admin.auth();
const db:any = admin.firestore();

export { auth, db };

