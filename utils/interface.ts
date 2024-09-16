import { User } from "firebase/auth";
import { FirebaseOptions } from "firebase/app";

// Define the UserData interface for type safety
export interface UserData {
    fullName: string;
    email: string;
    password: string;
    role: string;
    referralCode?: string;
  }

  export const requiredEnvVars = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_DATABASE_URL",
  ];
  export interface AuthResponse {
    user: User;
    token: string;
  }
  // Define the type for the Firebase configuration
export interface FirebaseConfig extends FirebaseOptions {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}