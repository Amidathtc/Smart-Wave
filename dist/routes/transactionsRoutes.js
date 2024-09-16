"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionsController_1 = require("../controllers/transactionsController");
const router = (0, express_1.Router)();
// Route to get all transactions
router.get("/transactions", transactionsController_1.getAllTransactionsController);
// Route to get a transaction by ID
router.get("/transaction/:transactionId", transactionsController_1.getTransactionByIdController);
// Route to get transactions by category
router.get("/category/:category", transactionsController_1.getTransactionByCategoryController);
// Route to get transaction details by ID
router.get("/transaction/:transactionId/details", transactionsController_1.getTransactionDetailsByIdController);
// Route to get transactions for a user
router.get("/user-transactions/:userId", transactionsController_1.getUserTransactionsController);
exports.default = router;
