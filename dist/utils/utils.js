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
exports.validateOTP = exports.sendOTPEmail = exports.generateOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const firebase_1 = require("../config/firebase"); // Ensure you have Firestore configured
const firestore_1 = require("firebase/firestore");
// Define OTP expiration time (5 minutes)
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const sendOTPEmail = (email, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, exports.generateOTP)();
    // Store OTP in Firestore with expiration
    const otpDocRef = (0, firestore_1.doc)(firebase_1.db, "otps", userId); // Using userId as the document ID
    const otpData = {
        otp,
        createdAt: new Date().getTime(),
    };
    // Store the OTP in Firestore
    yield (0, firestore_1.setDoc)(otpDocRef, otpData);
    // Validate environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) {
        throw new Error("Email configuration is not set in environment variables.");
    }
    // Create a transporter object
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
    // Define mail options
    const mailOptions = {
        from: emailUser,
        to: email,
        subject: "Your OTP for Verification",
        text: `Your OTP is: ${otp}\n\nPlease use this OTP to complete your verification process.`,
    };
    // Send the email
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Failed to send OTP email. Please try again later.");
    }
});
exports.sendOTPEmail = sendOTPEmail;
// Function to validate the OTP
const validateOTP = (userId, inputOtp) => __awaiter(void 0, void 0, void 0, function* () {
    const otpDocRef = (0, firestore_1.doc)(firebase_1.db, "otps", userId);
    const otpDoc = yield (0, firestore_1.getDoc)(otpDocRef);
    if (otpDoc.exists()) {
        const { otp, createdAt } = otpDoc.data();
        const currentTime = new Date().getTime();
        console.log("otp", otp);
        console.log("otpInput", inputOtp);
        // Check if the OTP matches and is still valid
        if (otp === inputOtp && (currentTime - createdAt) < OTP_EXPIRATION_TIME) {
            // OTP is valid
            return true;
        }
    }
    // OTP is invalid or expired
    return false;
});
exports.validateOTP = validateOTP;
