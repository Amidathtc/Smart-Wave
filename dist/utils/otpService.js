"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const OTP_LENGTH = 4;
const generateOTP = () => {
    return crypto_1.default
        .randomInt(0, 10 ** OTP_LENGTH)
        .toString()
        .padStart(OTP_LENGTH, "0");
};
exports.generateOTP = generateOTP;
// You can store the OTP in-memory or in Firestore for verification
const otps = {}; // In-memory storage for demonstration
const sendOTP = (phoneNumber) => {
    const otp = (0, exports.generateOTP)();
    otps[phoneNumber] = otp; // Store OTP
    // Here you would integrate with an SMS service to send the OTP
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
    return otp;
};
exports.sendOTP = sendOTP;
const verifyOTP = (phoneNumber, otp) => {
    return otps[phoneNumber] === otp;
};
exports.verifyOTP = verifyOTP;
