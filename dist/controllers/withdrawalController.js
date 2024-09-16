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
exports.getPendingWithdrawalsController = exports.getAWithdrawalByIdController = exports.getAUserWithdrawalsController = exports.getAllWithdrawalsController = exports.approveWithdrawalController = exports.createWithdrawalController = void 0;
const withdrawalModel_1 = require("../models/withdrawalModel");
const userModel_1 = require("../models/userModel");
// Create a Withdrawal Request
const createWithdrawalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount, accountNumber, accountName, bank } = req.body;
    if (!userId || !amount || !accountNumber || !accountName || !bank) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const withdrawalRequestId = yield (0, withdrawalModel_1.createWithdrawalRequest)({
            userId,
            amount,
            accountNumber,
            accountName,
            bank,
            status: "pending", // Set initial status to pending
            createdAt: new Date().toISOString(),
        });
        res.status(201).json({
            message: "Withdrawal request created successfully.",
            withdrawalRequestId,
        });
    }
    catch (error) {
        console.error("Error creating withdrawal request:", error);
        res.status(500).json({
            error: "Failed to create withdrawal request. Please try again later.",
        });
    }
});
exports.createWithdrawalController = createWithdrawalController;
// Approve or Reject Withdrawal Request
const approveWithdrawalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, status } = req.body;
    const userId = req.params.userId; // Assuming userId is passed in the URL
    if (!requestId || !status) {
        return res
            .status(400)
            .json({ error: "Request ID and status are required." });
    }
    try {
        // Check if the user is an admin
        const user = yield (0, userModel_1.getUserById)(userId);
        if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
            return res.status(403).json({
                error: "Forbidden. Only admins can approve or reject withdrawal requests.",
            });
        }
        yield (0, withdrawalModel_1.updateWithdrawalApproval)(requestId, status);
        res.status(200).json({
            message: "Withdrawal request approval status updated successfully.",
        });
    }
    catch (error) {
        console.error("Error updating withdrawal approval status:", error);
        res.status(500).json({
            error: "Failed to update withdrawal approval status. Please try again later.",
        });
    }
});
exports.approveWithdrawalController = approveWithdrawalController;
// Get all withdrawals
const getAllWithdrawalsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const withdrawals = yield (0, withdrawalModel_1.getAllWithdrawals)();
        res.status(200).json(withdrawals);
    }
    catch (error) {
        console.error("Error retrieving withdrawals:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve withdrawals. Please try again later.",
        });
    }
});
exports.getAllWithdrawalsController = getAllWithdrawalsController;
// Get withdrawals for a user
const getAUserWithdrawalsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Extract userId from request parameters
    try {
        const withdrawals = yield (0, withdrawalModel_1.getAUserWithdrawals)(userId);
        res.status(200).json(withdrawals);
    }
    catch (error) {
        console.error("Error retrieving user withdrawals:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve user withdrawals. Please try again later.",
        });
    }
});
exports.getAUserWithdrawalsController = getAUserWithdrawalsController;
// Get a withdrawal by ID
const getAWithdrawalByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { withdrawalId } = req.params; // Extract withdrawalId from request parameters
    try {
        const withdrawal = yield (0, withdrawalModel_1.getAWithdrawalById)(withdrawalId);
        if (!withdrawal) {
            return res.status(404).json({ error: "Withdrawal not found." });
        }
        res.status(200).json(withdrawal);
    }
    catch (error) {
        console.error("Error retrieving withdrawal:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve withdrawal. Please try again later.",
        });
    }
});
exports.getAWithdrawalByIdController = getAWithdrawalByIdController;
// Get pending withdrawals
const getPendingWithdrawalsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const withdrawals = yield (0, withdrawalModel_1.getPendingWithdrawals)();
        res.status(200).json(withdrawals);
    }
    catch (error) {
        console.error("Get pending withdrawals error:", error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching pending withdrawals" });
    }
});
exports.getPendingWithdrawalsController = getPendingWithdrawalsController;
