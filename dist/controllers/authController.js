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
exports.regenerateOtpController = exports.loginUser = exports.sendVerification = exports.verifyEmail = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
const errorUtils_1 = require("../utils/errorUtils");
const HTTPCODES_1 = require("../utils/HTTPCODES");
const emailUtils_1 = require("../utils/emailUtils");
dotenv_1.default.config();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        let user;
        if (data.role === "affiliate") {
            user = yield (0, userModel_1.registerAffiliate)(data);
        }
        else if (data.role === "vendor") {
            user = yield (0, userModel_1.registerVendor)(data);
        }
        else {
            throw new Error("Invalid user role");
        }
        res
            .status(201)
            .json({ message: "User registered successfully", data: user });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(error.httpcode || 500).json({ error: error.message });
    }
});
exports.registerUser = registerUser;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const result = yield (0, userModel_1.verifyEmailToken)(email, otp);
        res.json({ message: "Email verified successfully", result });
    }
    catch (error) {
        console.error("Error verifying email:", error);
        res.status(error.httpcode || 500).json({ error: error.message });
    }
});
exports.verifyEmail = verifyEmail;
const sendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, userModel_1.sendVerificationEmail)(email);
        res.json({ message: "Verification email sent successfully" });
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        res.status(error.httpcode || 500).json({ error: error.message });
    }
});
exports.sendVerification = sendVerification;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Authenticate the user
        const authResponse = yield (0, userModel_1.authenticateUser)(email, password);
        // Check if authResponse is defined
        if (!authResponse) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const { user, token } = authResponse;
        // Return the user and token
        res.json({ message: "Login successful", user, token });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        // Handle specific error cases
        if (error instanceof errorUtils_1.MainAppError) {
            res.status(error.httpcode).json({ error: error.message });
        }
        else {
            res
                .status(HTTPCODES_1.HTTPCODES.INTERNAL_SERVER_ERROR)
                .json({ error: "An error occurred while logging in" });
        }
    }
});
exports.loginUser = loginUser;
// Regenerate OTP Controller
const regenerateOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Expecting userId request params
    const { email } = req.body; // Expecting userId and email in the request body
    if (!userId || !email) {
        return res.status(400).json({ error: "User ID and email are required." });
    }
    try {
        const newOtp = yield (0, emailUtils_1.regenerateOTP)(userId, email);
        res
            .status(200)
            .json({ message: "New OTP sent successfully.", otp: newOtp });
    }
    catch (error) {
        console.error("Error regenerating OTP:", error);
        res
            .status(500)
            .json({ error: "Failed to regenerate OTP. Please try again later." });
    }
});
exports.regenerateOtpController = regenerateOtpController;
