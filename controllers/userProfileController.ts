import { Request, Response } from "express";
import {
  getUserByEmail,
  getUserById,
  updateUserPin,
  updateUserProfile,
} from "../models/userModel";
import { sendOTP, verifyOTP } from "../utils/otpService";
import { validateOTP } from "../utils/emailUtils";

// Edit Profile
export const editProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId; // Assuming userId is passed in the URL
  const { photo, username, name, bio, dateOfBirth, phoneNumber } = req.body;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedData: any = {};
    if (photo) updatedData.photo = photo;
    if (username) updatedData.username = username;
    if (name) updatedData.name = name;
    if (bio) updatedData.bio = bio;
    if (dateOfBirth) updatedData.dateOfBirth = dateOfBirth;

    await updateUserProfile(userId, updatedData);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

// Send OTP for Phone Number Verification
export const sendVerificationOTP = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = sendOTP(phoneNumber);
  res.status(200).json({ message: "OTP sent", otp }); // In production, do not return the OTP
};

// Verify OTP
export const verifyPhoneNumber = async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  const isValid = verifyOTP(phoneNumber, otp);
  if (isValid) {
    // Update user status or phone number in Firestore
    res.status(200).json({ message: "Phone number verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
};

// Change Transaction PIN
export const changePinController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { currentPin, newPin, confirmNewPin } = req.body;

  if (!userId || !currentPin || !newPin || !confirmNewPin) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (newPin !== confirmNewPin) {
    return res.status(400).json({ error: "New PINs do not match." });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the current PIN matches
    if (user.transactionPin !== currentPin) {
      return res.status(400).json({ error: "Current PIN is incorrect." });
    }

    // Update the PIN
    await updateUserPin(userId, newPin);
    res.status(200).json({ message: "PIN changed successfully." });
  } catch (error) {
    console.error("Error changing PIN:", error);
    res
      .status(500)
      .json({ error: "Failed to change PIN. Please try again later." });
  }
};

// Forgot Transaction PIN
export const forgotPinController = async (req: Request, res: Response) => {
  const { email, newPin, confirmNewPin } = req.body;

  if (!email || !newPin || !confirmNewPin) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (newPin !== confirmNewPin) {
    return res.status(400).json({ error: "New PINs do not match." });
  }

  try {
    const user = await getUserByEmail(email); // Implement this function to get user by email
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the PIN
    await updateUserPin(user.id, newPin);
    res.status(200).json({ message: "PIN reset successfully." });
  } catch (error) {
    console.error("Error resetting PIN:", error);
    res
      .status(500)
      .json({ error: "Failed to reset PIN. Please try again later." });
  }
};
