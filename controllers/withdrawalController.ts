import { Request, Response } from "express";
import {
  createWithdrawalRequest,
  getPendingWithdrawals,
  updateWithdrawalApproval,
  getAUserWithdrawals,
  getAWithdrawalById,
  getAllWithdrawals,
} from "../models/withdrawalModel";
import { getUserById } from "../models/userModel";

// Create a Withdrawal Request
export const createWithdrawalController = async (
  req: Request,
  res: Response
) => {
  const { userId, amount, accountNumber, accountName, bank } = req.body;

  if (!userId || !amount || !accountNumber || !accountName || !bank) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const withdrawalRequestId = await createWithdrawalRequest({
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
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    res.status(500).json({
      error: "Failed to create withdrawal request. Please try again later.",
    });
  }
};

// Approve or Reject Withdrawal Request
export const approveWithdrawalController = async (
  req: Request,
  res: Response
) => {
  const { requestId, status } = req.body;
  const userId = req.params.userId; // Assuming userId is passed in the URL

  if (!requestId || !status) {
    return res
      .status(400)
      .json({ error: "Request ID and status are required." });
  }

  try {
    // Check if the user is an admin
    const user = await getUserById(userId);
    if (user?.role !== "admin") {
      return res.status(403).json({
        error:
          "Forbidden. Only admins can approve or reject withdrawal requests.",
      });
    }

    await updateWithdrawalApproval(requestId, status);
    res.status(200).json({
      message: "Withdrawal request approval status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating withdrawal approval status:", error);
    res.status(500).json({
      error:
        "Failed to update withdrawal approval status. Please try again later.",
    });
  }
};

// Get all withdrawals
export const getAllWithdrawalsController = async (
  req: Request,
  res: Response
) => {
  try {
    const withdrawals = await getAllWithdrawals();
    res.status(200).json(withdrawals);
  } catch (error) {
    console.error("Error retrieving withdrawals:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve withdrawals. Please try again later.",
      });
  }
};

// Get withdrawals for a user
export const getAUserWithdrawalsController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
    const withdrawals = await getAUserWithdrawals(userId);
    res.status(200).json(withdrawals);
  } catch (error) {
    console.error("Error retrieving user withdrawals:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve user withdrawals. Please try again later.",
      });
  }
};

// Get a withdrawal by ID
export const getAWithdrawalByIdController = async (
  req: Request,
  res: Response
) => {
  const { withdrawalId } = req.params; // Extract withdrawalId from request parameters
  try {
    const withdrawal = await getAWithdrawalById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal not found." });
    }
    res.status(200).json(withdrawal);
  } catch (error) {
    console.error("Error retrieving withdrawal:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve withdrawal. Please try again later.",
      });
  }
};

// Get pending withdrawals
export const getPendingWithdrawalsController = async (
  req: Request,
  res: Response
) => {
  try {
    const withdrawals = await getPendingWithdrawals();
    res.status(200).json(withdrawals);
  } catch (error) {
    console.error("Get pending withdrawals error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching pending withdrawals" });
  }
};
