// import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   getIdToken,
//   sendEmailVerification,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";
// import dotenv from 'dotenv';
// dotenv.config();

// // Define the type for the Firebase configuration
// interface FirebaseConfig extends FirebaseOptions {
//   apiKey: string;
//   authDomain: string;
//   databaseURL: string;
//   projectId: string;
//   storageBucket: string;
//   messagingSenderId: string;
//   appId: string;
//   measurementId: string;
// }

// // Load Firebase configuration from environment variables
// const firebaseConfig: FirebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY || "",
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
//   databaseURL: process.env.FIREBASE_DATABASE_URL || "",
//   projectId: process.env.FIREBASE_PROJECT_ID || "",
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: process.env.FIREBASE_APP_ID || "",
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
// };

// // Initialize Firebase app
// let app: FirebaseApp;
// let auth: ReturnType<typeof getAuth>;
// let db: ReturnType<typeof getFirestore>;

// try {
//   app = initializeApp(firebaseConfig);
//   console.log('Firebase initialized successfully');
// } catch (error) {
//   console.error('Error initializing Firebase:', error);
//   throw error;
// }

// try {
//   auth = getAuth(app);
//   console.log('Firebase Auth initialized successfully');
// } catch (error) {
//   console.error('Error initializing Firebase Auth:', error);
//   throw error;
// }

// try {
//   db = getFirestore(app);
//   console.log('Firebase Firestore initialized successfully');
// } catch (error) {
//   console.error('Error initializing Firebase Firestore:', error);
//   throw error;
// }

// /**
//  * Export Firebase modules
//  */

// export {
//   auth,
//   db,
//   createUserWithEmailAndPassword,
//   getIdToken,
//   sendEmailVerification,
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
// };
import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  getIdToken,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define the type for the Firebase configuration
interface FirebaseConfig extends FirebaseOptions {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Load Firebase configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
};

// Function to initialize Firebase
const initializeFirebase = () => {
  // Check if all required environment variables are set
  
const requiredEnvVars = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_DATABASE_URL",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_APP_ID",
    "FIREBASE_MEASUREMENT_ID",
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.error(`Error: Environment variable ${varName} is not set.`);
      throw new Error(`${varName} is not set in the environment variables.`);
    }
  }

  // Initialize Firebase app
  let app: FirebaseApp;
  let auth: Auth;
  let db: Firestore;

  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }

  try {
    auth = getAuth(app);
    console.log("Firebase Auth initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Auth:", error);
    throw error;
  }

  try {
    db = getFirestore(app);
    console.log("Firebase Firestore initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Firestore:", error);
    throw error;
  }

  return { app, auth, db };
};

// Initialize Firebase and export modules
const { app, auth, db } = initializeFirebase();

export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  getIdToken,
  sendEmailVerification,
  doc,
  setDoc,
  getDoc,
  updateDoc,
};
