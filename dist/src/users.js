"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.generateAccessToken = exports.updateUserStatus = exports.verifyEmailToken = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = exports.addUser = void 0;
const firebase_1 = require("../config/firebase");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const utils_1 = require("../utils/utils");
const HTTPCODES_1 = require("../utils/HTTPCODES");
const MainAppError_1 = require("../utils/MainAppError");
const auth_2 = require("../utils/auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Function to add a new user to the authentication and Firestore
const addUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield (0, auth_2.hashPassword)(data.password);
        const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, data.email, hashedPassword);
        const otp = (0, utils_1.generateOTP)();
        const userReferralCode = data.referralCode || generateReferralCode(userCredential.user.uid);
        // Store user data in Firestore
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "users", userCredential.user.uid), {
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            referralCode: userReferralCode,
            wallet: { balance: 0 },
        });
        // Store OTP in a separate document
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "otps", userCredential.user.uid), {
            otp,
            createdAt: new Date().getTime(),
        });
        // Send OTP email
        yield (0, utils_1.sendOTPEmail)(data.email, otp);
        return userCredential.user;
    }
    catch (error) {
        handleAuthError(error);
    }
});
exports.addUser = addUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = (0, firestore_1.collection)(firebase_1.db, "users");
        const usersSnapshot = yield (0, firestore_1.getDocs)(usersRef);
        const users = usersSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return users;
    }
    catch (error) {
        console.error("Error getting all users:", error);
        throw new Error("Failed to retrieve users");
    }
});
exports.getAllUsers = getAllUsers;
// Function to get user data by ID
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDocRef = (0, firestore_1.doc)(firebase_1.db, "users", userId);
        const userDoc = yield (0, firestore_1.getDoc)(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data();
        }
        else {
            throw new MainAppError_1.MainAppError({
                message: "User not found",
                httpcode: HTTPCODES_1.HTTPCODES.NOT_FOUND,
            });
        }
    }
    catch (error) {
        console.error("Error getting user by ID:", error);
        throw new MainAppError_1.MainAppError({
            message: "Failed to retrieve user data",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getUserById = getUserById;
// Function to get user data by email
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = (0, firestore_1.doc)(firebase_1.db, "users", email);
        const userData = yield (0, firestore_1.getDoc)(usersRef);
        return userData.exists() ? userData.data() : null;
    }
    catch (error) {
        console.error("Error getting user by email:", error);
        throw new MainAppError_1.MainAppError({
            message: "Failed to retrieve user data",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getUserByEmail = getUserByEmail;
// Function to verify the email token (OTP)
const verifyEmailToken = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = email; // Assuming you are using email as the user ID
        const isValid = yield (0, utils_1.validateOTP)(userId, otp);
        if (isValid) {
            // Proceed with marking the user as verified
            yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId), { verified: true });
            return { message: "Email verified successfully" };
        }
        else {
            throw new MainAppError_1.MainAppError({
                message: "Invalid OTP or user not found",
                httpcode: HTTPCODES_1.HTTPCODES.BAD_REQUEST,
            });
        }
    }
    catch (error) {
        console.error("Error verifying email:", error);
        throw new MainAppError_1.MainAppError({
            message: "Error verifying email token",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.verifyEmailToken = verifyEmailToken;
// Function to update user status
const updateUserStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId), { status });
    }
    catch (error) {
        console.error("Error updating user status:", error);
        throw new MainAppError_1.MainAppError({
            message: "Failed to update user status",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.updateUserStatus = updateUserStatus;
// Function to generate an access token for the user
const generateAccessToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, auth_1.getIdToken)(user);
    }
    catch (error) {
        console.error("Error generating access token:", error);
        throw new MainAppError_1.MainAppError({
            message: "Failed to generate access token",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.generateAccessToken = generateAccessToken;
// Function to send a verification email to the user
const sendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user) {
            throw new MainAppError_1.MainAppError({
                message: "No user is currently signed in.",
                httpcode: HTTPCODES_1.HTTPCODES.UNAUTHORIZED,
            });
        }
        yield (0, auth_1.sendEmailVerification)(user);
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        throw new MainAppError_1.MainAppError({
            message: "Failed to send verification email",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
// Function to generate a referral code based on the user ID
const generateReferralCode = (userId) => {
    return `REF-${userId.substring(0, 8).toUpperCase()}`;
};
// Helper function to handle authentication errors
const handleAuthError = (error) => {
    if (error.code === "auth/email-already-in-use") {
        throw new MainAppError_1.MainAppError({
            message: "Email already in use",
            httpcode: HTTPCODES_1.HTTPCODES.BAD_REQUEST,
        });
    }
    console.error("Error adding user:", error);
    throw new MainAppError_1.MainAppError({
        message: "An error occurred while adding the user",
        httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
    });
};
