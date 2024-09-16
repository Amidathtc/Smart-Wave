import { Router } from "express";
import {
  getAllTransactionsController,
  getTransactionByCategoryController,
  getTransactionByIdController,
  getTransactionDetailsByIdController,
  getUserTransactionsController,
} from "../controllers/transactionsController";

const router = Router();

// Route to get all transactions
router.get("/transactions", getAllTransactionsController);

// Route to get a transaction by ID
router.get("/transaction/:transactionId", getTransactionByIdController);

// Route to get transactions by category
router.get("/category/:category", getTransactionByCategoryController);

// Route to get transaction details by ID
router.get(
  "/transaction/:transactionId/details",
  getTransactionDetailsByIdController
);

// Route to get transactions for a user
router.get("/user-transactions/:userId", getUserTransactionsController);

export default router;
