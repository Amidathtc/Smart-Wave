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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBankDetailsController = exports.setTransactionPinController = exports.updatePasswordController = exports.updateStatus = exports.getUserByEmailEndpoint = exports.getUser = exports.getUsers = void 0;
const userModel_1 = require("../models/userModel");
const emailUtils_1 = require("../utils/emailUtils");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userModel_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield (0, userModel_1.getUserById)(id);
        res.json(user);
    }
    catch (error) {
        res.status(error.httpcode || 500).json({ error: error.message });
    }
});
exports.getUser = getUser;
const getUserByEmailEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield (0, userModel_1.getUserByEmail)(email);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(error.httpcode || 500).json({ error: error.message });
    }
});
exports.getUserByEmailEndpoint = getUserByEmailEndpoint;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        yield (0, userModel_1.updateUserStatus)(id, status);
        res.json({ message: "User status updated successfully" });
    }
    catch (error) {
        res.status(error.httpcode || 500).json({ error: error.message });
    }
});
exports.updateStatus = updateStatus;
// Update/Change Password
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, confirmPassword, otp } = req.body;
    if (!email || !newPassword || !confirmPassword || !otp) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }
    try {
        const isValidOtp = yield (0, emailUtils_1.validateOTP)(email, otp);
        if (!isValidOtp) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }
        yield (0, userModel_1.updateUserPassword)(email, newPassword);
        res.status(200).json({ message: "Password updated successfully." });
    }
    catch (error) {
        console.error("Error updating password:", error);
        res
            .status(500)
            .json({ error: "Failed to update password. Please try again later." });
    }
});
exports.updatePasswordController = updatePasswordController;
// Set Transaction PIN
const setTransactionPinController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { newPin, confirmNewPin } = req.body;
    if (!userId || !newPin || !confirmNewPin) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (newPin !== confirmNewPin) {
        return res.status(400).json({ error: "Pins do not match." });
    }
    try {
        yield (0, userModel_1.storeUserPin)(userId, newPin);
        res.status(200).json({ message: "Transaction pin set successfully." });
    }
    catch (error) {
        console.error("Error setting transaction pin:", error);
        res.status(500).json({
            error: "Failed to set transaction pin. Please try again later.",
        });
    }
});
exports.setTransactionPinController = setTransactionPinController;
// Upload Bank Details
const uploadBankDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { accountNumber, bvn, bankName, otp } = req.body;
    if (!userId || !accountNumber || !bvn || !bankName || !otp) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const isValidOtp = yield (0, emailUtils_1.validateOTP)(userId, otp);
        if (!isValidOtp) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }
        yield (0, userModel_1.uploadBankDetails)(userId, { accountNumber, bvn, bankName });
        res.status(200).json({ message: "Bank details uploaded successfully." });
    }
    catch (error) {
        console.error("Error uploading bank details:", error);
        res.status(500).json({
            error: "Failed to upload bank details. Please try again later.",
        });
    }
});
exports.uploadBankDetailsController = uploadBankDetailsController;
