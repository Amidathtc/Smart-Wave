import { Request, Response } from "express";
import {
  getAllTransactions,
  getTransactionByCategory,
  getTransactionById,
  getTransactionDetailsById,
  getUserTransactions,
} from "../models/transactionsModel";

// Get all transactions
export const getAllTransactionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({
      error: "Failed to retrieve transactions. Please try again later.",
    });
  }
};

// Get transactions by category
export const getTransactionByCategoryController = async (
  req: Request,
  res: Response
) => {
  const { category } = req.params; // Extract category from request parameters
  try {
    const transactions = await getTransactionByCategory(category);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions by category:", error);
    res
      .status(500)
      .json({
        error:
          "Failed to retrieve transactions by category. Please try again later.",
      });
  }
};

// Get a transaction by ID
export const getTransactionByIdController = async (
  req: Request,
  res: Response
) => {
  const { transactionId } = req.params; // Extract transactionId from request parameters

  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    res.status(500).json({
      error: "Failed to retrieve transaction. Please try again later.",
    });
  }
};

// Get transaction details by ID
export const getTransactionDetailsByIdController = async (
  req: Request,
  res: Response
) => {
  const { transactionId } = req.params; // Extract transactionId from request parameters

  try {
    const transactionDetails = await getTransactionDetailsById(transactionId);
    if (!transactionDetails) {
      return res.status(404).json({ error: "Transaction details not found." });
    }
    res.status(200).json(transactionDetails);
  } catch (error) {
    console.error("Error retrieving transaction details:", error);
    res.status(500).json({
      error: "Failed to retrieve transaction details. Please try again later.",
    });
  }
};

// Get transactions for a user
export const getUserTransactionsController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    const userTransactions = await getUserTransactions(userId);
    res.status(200).json(userTransactions);
  } catch (error) {
    console.error("Error retrieving user transactions:", error);
    res.status(500).json({
      error: "Failed to retrieve user transactions. Please try again later.",
    });
  }
};
