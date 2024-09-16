"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoc = exports.getDoc = exports.setDoc = exports.doc = exports.sendEmailVerification = exports.getIdToken = exports.createUserWithEmailAndPassword = exports.db = exports.auth = exports.app = void 0;
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
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
Object.defineProperty(exports, "createUserWithEmailAndPassword", { enumerable: true, get: function () { return auth_1.createUserWithEmailAndPassword; } });
Object.defineProperty(exports, "getIdToken", { enumerable: true, get: function () { return auth_1.getIdToken; } });
Object.defineProperty(exports, "sendEmailVerification", { enumerable: true, get: function () { return auth_1.sendEmailVerification; } });
const firestore_1 = require("firebase/firestore");
Object.defineProperty(exports, "doc", { enumerable: true, get: function () { return firestore_1.doc; } });
Object.defineProperty(exports, "setDoc", { enumerable: true, get: function () { return firestore_1.setDoc; } });
Object.defineProperty(exports, "getDoc", { enumerable: true, get: function () { return firestore_1.getDoc; } });
Object.defineProperty(exports, "updateDoc", { enumerable: true, get: function () { return firestore_1.updateDoc; } });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Load Firebase configuration from environment variables
const firebaseConfig = {
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
    let app;
    let auth;
    let db;
    try {
        app = (0, app_1.initializeApp)(firebaseConfig);
        console.log("Firebase initialized successfully");
    }
    catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
    try {
        auth = (0, auth_1.getAuth)(app);
        console.log("Firebase Auth initialized successfully");
    }
    catch (error) {
        console.error("Error initializing Firebase Auth:", error);
        throw error;
    }
    try {
        db = (0, firestore_1.getFirestore)(app);
        console.log("Firebase Firestore initialized successfully");
    }
    catch (error) {
        console.error("Error initializing Firebase Firestore:", error);
        throw error;
    }
    return { app, auth, db };
};
// Initialize Firebase and export modules
const { app, auth, db } = initializeFirebase();
exports.app = app;
exports.auth = auth;
exports.db = db;
