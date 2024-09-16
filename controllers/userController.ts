import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserStatus,
  uploadBankDetails,
  storeUserPin,
  updateUserPassword,
} from "../models/userModel";
import { validateOTP } from "../utils/emailUtils";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    res.json(user);
  } catch (error: any) {
    res.status(error.httpcode || 500).json({ error: error.message });
  }
};

export const getUserByEmailEndpoint = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    res.status(error.httpcode || 500).json({ error: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await updateUserStatus(id, status);
    res.json({ message: "User status updated successfully" });
  } catch (error: any) {
    res.status(error.httpcode || 500).json({ error: error.message });
  }
};

// Update/Change Password
export const updatePasswordController = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword, otp } = req.body;

  if (!email || !newPassword || !confirmPassword || !otp) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const isValidOtp = await validateOTP(email, otp);
    if (!isValidOtp) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    await updateUserPassword(email, newPassword);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ error: "Failed to update password. Please try again later." });
  }
};

// Set Transaction PIN
export const setTransactionPinController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;
  const { newPin, confirmNewPin } = req.body;

  if (!userId || !newPin || !confirmNewPin) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (newPin !== confirmNewPin) {
    return res.status(400).json({ error: "Pins do not match." });
  }

  try {
    await storeUserPin(userId, newPin);
    res.status(200).json({ message: "Transaction pin set successfully." });
  } catch (error) {
    console.error("Error setting transaction pin:", error);
    res.status(500).json({
      error: "Failed to set transaction pin. Please try again later.",
    });
  }
};

// Upload Bank Details
export const uploadBankDetailsController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;
  const { accountNumber, bvn, bankName, otp } = req.body;

  if (!userId || !accountNumber || !bvn || !bankName || !otp) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const isValidOtp = await validateOTP(userId, otp);
    if (!isValidOtp) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    await uploadBankDetails(userId, { accountNumber, bvn, bankName });
    res.status(200).json({ message: "Bank details uploaded successfully." });
  } catch (error) {
    console.error("Error uploading bank details:", error);
    res.status(500).json({
      error: "Failed to upload bank details. Please try again later.",
    });
  }
};
