"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const ServiceAccountKey_json_1 = __importDefault(require("../config/ServiceAccountKey.json"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure the serviceAccount object matches the expected type
const serviceAccountConfig = ServiceAccountKey_json_1.default;
try {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccountConfig),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('Firebase initialized successfully');
}
catch (error) {
    console.error('Error initializing Firebase:', error);
}
const auth = firebase_admin_1.default.auth();
exports.auth = auth;
const db = firebase_admin_1.default.firestore();
exports.db = db;
