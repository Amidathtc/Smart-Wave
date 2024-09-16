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
exports.getPurchaseByIdController = exports.getPurchasesByUserIdController = exports.getAllPurchasesController = exports.purchaseProductController = void 0;
const purchaseModel_1 = require("../models/purchaseModel");
const productModel_1 = require("../models/productModel");
const userModel_1 = require("../models/userModel");
// Purchase a product
const purchaseProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, quantity, name, email } = req.body;
    if (!userId || !productId || !quantity || !name || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const user = yield (0, userModel_1.getUserById)(userId);
        const product = yield (0, productModel_1.getProductById)(productId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        if (quantity > product.quantity) {
            return res
                .status(400)
                .json({ error: "Quantity exceeds available stock." });
        }
        const totalCost = product.price * quantity;
        if (user.walletBalance < totalCost) {
            return res.status(400).json({ error: "Insufficient wallet balance." });
        }
        // Deduct from user wallet
        const newBalance = user.walletBalance - totalCost;
        yield (0, userModel_1.updateUserWallet)(userId, newBalance);
        // Update product quantity
        const newQuantity = product.quantity - quantity;
        yield (0, productModel_1.updateProductQuantity)(productId, newQuantity);
        // Create purchase record
        const purchaseId = yield (0, purchaseModel_1.createPurchase)({
            userId,
            productId,
            quantity,
            name,
            email,
            totalCost,
            createdAt: new Date().toISOString(),
        });
        res.status(201).json({ message: "Purchase successful.", purchaseId });
    }
    catch (error) {
        console.error("Error processing purchase:", error);
        res
            .status(500)
            .json({ error: "Failed to process purchase. Please try again later." });
    }
});
exports.purchaseProductController = purchaseProductController;
// Get all purchases
const getAllPurchasesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield (0, purchaseModel_1.getAllPurchases)();
        res.status(200).json(purchases);
    }
    catch (error) {
        console.error("Error retrieving purchases:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve purchases. Please try again later." });
    }
});
exports.getAllPurchasesController = getAllPurchasesController;
// Get purchases by user ID
const getPurchasesByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const purchases = yield (0, purchaseModel_1.getPurchasesByUserId)(userId);
        res.status(200).json(purchases);
    }
    catch (error) {
        console.error("Error retrieving user purchases:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve user purchases. Please try again later.",
        });
    }
});
exports.getPurchasesByUserIdController = getPurchasesByUserIdController;
// Get purchase by ID
const getPurchaseByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { purchaseId } = req.params;
    try {
        const purchase = yield (0, purchaseModel_1.getPurchaseById)(purchaseId);
        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found." });
        }
        res.status(200).json(purchase);
    }
    catch (error) {
        console.error("Error retrieving purchase:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve purchase. Please try again later." });
    }
});
exports.getPurchaseByIdController = getPurchaseByIdController;
