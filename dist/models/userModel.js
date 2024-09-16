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
exports.updateUserPin = exports.uploadBankDetails = exports.storeUserPin = exports.updateUserPassword = exports.sendVerificationEmail = exports.updateUserWallet = exports.updateUserProfile = exports.updateUserStatus = exports.authenticateUser = exports.verifyEmailToken = exports.getUserByEmail = exports.isVendorOrAdmin = exports.getUserById = exports.getAllUsers = exports.registerVendor = exports.registerAffiliate = void 0;
const firebase_1 = require("../config/firebase");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const emailUtils_1 = require("../utils/emailUtils");
const HTTPCODES_1 = require("../utils/HTTPCODES");
const authUtils_1 = require("../utils/authUtils");
const nodemailer_1 = __importDefault(require("nodemailer"));
const errorUtils_1 = require("../utils/errorUtils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Affiliate Registration
const registerAffiliate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hash the password
        const hashedPassword = yield (0, authUtils_1.hashPassword)(data.password);
        // Create user with Firebase Authentication using the plain password
        const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, data.email, data.password // Use the plain password for Firebase Authentication
        );
        const userReferralCode = data.referralCode || generateReferralCode(userCredential.user.uid);
        // Generate OTP
        const otp = (0, emailUtils_1.generateOTP)();
        // Store user data in Firestore, including the hashed password and additional fields
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "users", userCredential.user.uid), {
            fullName: data.fullName,
            email: data.email,
            role: "affiliate",
            referralCode: userReferralCode,
            wallet: { balance: 0 },
            password: hashedPassword, // Store the hashed password
            registrationFeeStatus: "pending", // Initial registration fee status
            purchases: [], // Initialize purchases as an empty array
            earnings: {
                totalUnpaidEarnings: 0,
                totalEarnings: 0,
                paidEarnings: 0,
                registrationEarnings: 0,
                referralEarnings: 0,
                bonusEarnings: 0,
            },
            withdrawals: [], // Initialize withdrawals as an empty array
            deposits: [], // Initialize deposits as an empty array
            transactions: [], // Initialize transactions as an empty array
            verified: false, // Set initial verification status
        });
        // Store OTP in Firestore
        yield (0, emailUtils_1.storeOTP)(userCredential.user.uid, otp);
        // Send OTP email
        yield (0, emailUtils_1.sendOTPEmail)(data.email, otp);
        // Return the user credential
        return userCredential.user;
    }
    catch (error) {
        handleAuthError(error);
    }
});
exports.registerAffiliate = registerAffiliate;
// the forge
// Alien: romulus
// blink twice
// it ends with us
// Vendor Registration
const registerVendor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hash the password
        const hashedPassword = yield (0, authUtils_1.hashPassword)(data.password);
        // Create user with Firebase Authentication using the plain password
        const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, data.email, data.password // Use the plain password for Firebase Authentication
        );
        const otp = (0, emailUtils_1.generateOTP)();
        const userReferralCode = data.referralCode || generateReferralCode(userCredential.user.uid);
        // Store user data in Firestore, including the hashed password and additional fields
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "users", userCredential.user.uid), {
            fullName: data.fullName,
            email: data.email,
            role: "vendor",
            referralCode: userReferralCode,
            wallet: { balance: 0 },
            password: hashedPassword, // Store the hashed password
            registrationFeeStatus: "pending", // Initial registration fee status
            purchases: [], // Initialize purchases as an empty array
            sales: [], // Initialize sales as an empty array
            earnings: {
                totalUnpaidEarnings: 0,
                totalEarnings: 0,
                paidEarnings: 0,
                totalSales: 0,
                registrationEarnings: 0,
                referralEarnings: 0,
                bonusEarnings: 0,
            },
            withdrawals: [], // Initialize withdrawals as an empty array
            deposits: [], // Initialize deposits as an empty array
            transactions: [], // Initialize transactions as an empty array
            verified: false, // Set initial verification status
        });
        // Store OTP in Firestore
        yield (0, emailUtils_1.storeOTP)(userCredential.user.uid, otp);
        // Send OTP email
        yield (0, emailUtils_1.sendOTPEmail)(data.email, otp);
        // Return the user credential
        return userCredential.user;
    }
    catch (error) {
        handleAuthError(error);
    }
});
exports.registerVendor = registerVendor;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = (0, firestore_1.collection)(firebase_1.db, "users");
        const usersSnapshot = yield (0, firestore_1.getDocs)(usersRef);
        return usersSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
    }
    catch (error) {
        console.error("Error getting all users:", error);
        throw new errorUtils_1.MainAppError({
            message: "Failed to retrieve users",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDocRef = (0, firestore_1.doc)(firebase_1.db, "users", userId);
        const userDoc = yield (0, firestore_1.getDoc)(userDocRef);
        if (!userDoc.exists()) {
            throw new errorUtils_1.MainAppError({
                message: "User not found",
                httpcode: HTTPCODES_1.HTTPCODES.NOT_FOUND,
            });
        }
        return userDoc.data();
    }
    catch (error) {
        console.error("Error getting user by ID:", error);
        throw new errorUtils_1.MainAppError({
            message: "Failed to retrieve user data",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getUserById = getUserById;
// Check if user is a vendor or admin
const isVendorOrAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    return (user === null || user === void 0 ? void 0 : user.role) === "vendor" || (user === null || user === void 0 ? void 0 : user.role) === "admin";
});
exports.isVendorOrAdmin = isVendorOrAdmin;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = (0, firestore_1.collection)(firebase_1.db, "users");
        const q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("email", "==", email));
        const userSnapshot = yield (0, firestore_1.getDocs)(q);
        if (userSnapshot.empty) {
            console.log("User not found by email:", email);
            return null;
        }
        const userDoc = userSnapshot.docs[0];
        return Object.assign({ id: userDoc.id }, userDoc.data());
    }
    catch (error) {
        console.error("Error getting user by email:", error);
        throw new errorUtils_1.MainAppError({
            message: "Failed to retrieve user data",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getUserByEmail = getUserByEmail;
const verifyEmailToken = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.getUserByEmail)(email);
        if (!user) {
            throw new errorUtils_1.MainAppError({
                message: "User not found",
                httpcode: HTTPCODES_1.HTTPCODES.NOT_FOUND,
            });
        }
        const userId = user.id;
        const isValid = yield (0, emailUtils_1.validateOTP)(userId, otp);
        if (isValid) {
            yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId), { verified: true });
            yield sendVerificationConfirmationEmail(email);
            return { message: "Email verified successfully" };
        }
        else {
            throw new errorUtils_1.MainAppError({
                message: "Invalid OTP or user not found",
                httpcode: HTTPCODES_1.HTTPCODES.BAD_REQUEST,
            });
        }
    }
    catch (error) {
        console.error("Error verifying email:", error);
        throw new errorUtils_1.MainAppError({
            message: "Error verifying email token",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.verifyEmailToken = verifyEmailToken;
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the user from Firestore
        const user = yield (0, exports.getUserByEmail)(email);
        // Check if user exists
        if (!user) {
            throw new errorUtils_1.MainAppError({
                message: "Invalid email or password",
                httpcode: HTTPCODES_1.HTTPCODES.UNAUTHORIZED,
            });
        }
        // Compare the inputted password with the hashed password
        const isPasswordValid = yield (0, authUtils_1.comparePasswords)(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isPasswordValid) {
            throw new errorUtils_1.MainAppError({
                message: "Invalid email or password",
                httpcode: HTTPCODES_1.HTTPCODES.UNAUTHORIZED,
            });
        }
        // Check if the user is verified
        if (!(user === null || user === void 0 ? void 0 : user.verified)) {
            throw new errorUtils_1.MainAppError({
                message: "Please verify your email before logging in",
                httpcode: HTTPCODES_1.HTTPCODES.UNAUTHORIZED,
            });
        }
        // Authenticate the user with Firebase (this step is optional if you're managing authentication through Firestore)
        const userCredential = yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
        const userFirebase = userCredential.user; // Get the user object from Firebase
        const token = yield (0, auth_1.getIdToken)(userFirebase); // Get the ID token
        // Return the user and token
        return { user: userFirebase, token };
    }
    catch (error) {
        console.error("Error authenticating user:", error);
        throw new errorUtils_1.MainAppError({
            message: "An error occurred while authenticating the user",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.authenticateUser = authenticateUser;
const updateUserStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId), { status });
    }
    catch (error) {
        console.error("Error updating user status:", error);
        throw new errorUtils_1.MainAppError({
            message: "Failed to update user status",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.updateUserStatus = updateUserStatus;
const updateUserProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userRef = (0, firestore_1.doc)(firebase_1.db, "users", userId);
    yield (0, firestore_1.updateDoc)(userRef, data);
});
exports.updateUserProfile = updateUserProfile;
// Update user wallet balance
const updateUserWallet = (userId, newBalance) => __awaiter(void 0, void 0, void 0, function* () {
    const userRef = (0, firestore_1.doc)(firebase_1.db, "users", userId);
    yield (0, firestore_1.updateDoc)(userRef, { walletBalance: newBalance });
});
exports.updateUserWallet = updateUserWallet;
const sendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user) {
            throw new errorUtils_1.MainAppError({
                message: "No user is currently signed in.",
                httpcode: HTTPCODES_1.HTTPCODES.UNAUTHORIZED,
            });
        }
        yield (0, auth_1.sendEmailVerification)(user);
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        throw new errorUtils_1.MainAppError({
            message: "Failed to send verification email",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
// Helper Functions
const generateReferralCode = (userId) => {
    return `REF-${userId.substring(0, 8).toUpperCase()}`;
};
const handleAuthError = (error) => {
    if (error.code === "auth/email-already-in-use") {
        throw new errorUtils_1.MainAppError({
            message: "Email already in use",
            httpcode: HTTPCODES_1.HTTPCODES.BAD_REQUEST,
        });
    }
    else if (error.code === "auth/invalid-email") {
        throw new errorUtils_1.MainAppError({
            message: "Invalid email address",
            httpcode: HTTPCODES_1.HTTPCODES.BAD_REQUEST,
        });
    }
    else if (error.code === "auth/weak-password") {
        throw new errorUtils_1.MainAppError({
            message: "Password should be at least 6 characters",
            httpcode: HTTPCODES_1.HTTPCODES.BAD_REQUEST,
        });
    }
    else if (error.code === "auth/network-request-failed") {
        throw new errorUtils_1.MainAppError({
            message: "Network error: Please check your internet connection.",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
    else {
        console.error("Error adding user:", error);
        throw new errorUtils_1.MainAppError({
            message: "An error occurred while adding the user",
            httpcode: HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        });
    }
};
const sendVerificationConfirmationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) {
        throw new Error("Email configuration is not set in environment variables.");
    }
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
    const mailOptions = {
        from: emailUser,
        to: email,
        subject: "Account Verification Successful",
        text: `Your account has been successfully verified.`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Verification confirmation email sent to ${email}`);
    }
    catch (error) {
        console.error("Error sending verification confirmation email:", error);
        throw new Error("Failed to send verification confirmation email. Please try again later.");
    }
});
const updateUserPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, newPassword); // Ensure user is authenticated
    yield (0, auth_1.updatePassword)(user.user, newPassword);
});
exports.updateUserPassword = updateUserPassword;
const storeUserPin = (userId, pin) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId), { transactionPin: pin }, { merge: true });
});
exports.storeUserPin = storeUserPin;
const uploadBankDetails = (userId, bankDetails) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "bankDetails", userId), bankDetails);
});
exports.uploadBankDetails = uploadBankDetails;
const updateUserPin = (userId, pin) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId), { transactionPin: pin }, { merge: true });
});
exports.updateUserPin = updateUserPin;
