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
exports.getUserTransactionsController = exports.getTransactionDetailsByIdController = exports.getTransactionByIdController = exports.getTransactionByCategoryController = exports.getAllTransactionsController = void 0;
const transactionsModel_1 = require("../models/transactionsModel");
// Get all transactions
const getAllTransactionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield (0, transactionsModel_1.getAllTransactions)();
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error("Error retrieving transactions:", error);
        res.status(500).json({
            error: "Failed to retrieve transactions. Please try again later.",
        });
    }
});
exports.getAllTransactionsController = getAllTransactionsController;
// Get transactions by category
const getTransactionByCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params; // Extract category from request parameters
    try {
        const transactions = yield (0, transactionsModel_1.getTransactionByCategory)(category);
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error("Error retrieving transactions by category:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve transactions by category. Please try again later.",
        });
    }
});
exports.getTransactionByCategoryController = getTransactionByCategoryController;
// Get a transaction by ID
const getTransactionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params; // Extract transactionId from request parameters
    try {
        const transaction = yield (0, transactionsModel_1.getTransactionById)(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found." });
        }
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error("Error retrieving transaction:", error);
        res.status(500).json({
            error: "Failed to retrieve transaction. Please try again later.",
        });
    }
});
exports.getTransactionByIdController = getTransactionByIdController;
// Get transaction details by ID
const getTransactionDetailsByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params; // Extract transactionId from request parameters
    try {
        const transactionDetails = yield (0, transactionsModel_1.getTransactionDetailsById)(transactionId);
        if (!transactionDetails) {
            return res.status(404).json({ error: "Transaction details not found." });
        }
        res.status(200).json(transactionDetails);
    }
    catch (error) {
        console.error("Error retrieving transaction details:", error);
        res.status(500).json({
            error: "Failed to retrieve transaction details. Please try again later.",
        });
    }
});
exports.getTransactionDetailsByIdController = getTransactionDetailsByIdController;
// Get transactions for a user
const getUserTransactionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Extract userId from request parameters
    try {
        const userTransactions = yield (0, transactionsModel_1.getUserTransactions)(userId);
        res.status(200).json(userTransactions);
    }
    catch (error) {
        console.error("Error retrieving user transactions:", error);
        res.status(500).json({
            error: "Failed to retrieve user transactions. Please try again later.",
        });
    }
});
exports.getUserTransactionsController = getUserTransactionsController;
