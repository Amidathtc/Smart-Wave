import { Request, Response } from "express";
import { UserData } from "../utils/interface";
import {
  authenticateUser,
  registerAffiliate,
  registerVendor,
  sendVerificationEmail,
  verifyEmailToken,
} from "../models/userModel";
import dotenv from "dotenv";
import { MainAppError } from "../utils/errorUtils";
import { HTTPCODES } from "../utils/HTTPCODES";
import { regenerateOTP } from "../utils/emailUtils";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  const data: UserData = req.body;
  try {
    let user;
    if (data.role === "affiliate") {
      user = await registerAffiliate(data);
    } else if (data.role === "vendor") {
      user = await registerVendor(data);
    } else {
      throw new Error("Invalid user role");
    }
    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(error.httpcode || 500).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const result = await verifyEmailToken(email, otp);
    res.json({ message: "Email verified successfully", result });
  } catch (error: any) {
    console.error("Error verifying email:", error);
    res.status(error.httpcode || 500).json({ error: error.message });
  }
};

export const sendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await sendVerificationEmail(email);
    res.json({ message: "Verification email sent successfully" });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    res.status(error.httpcode || 500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Authenticate the user
    const authResponse = await authenticateUser(email, password);

    // Check if authResponse is defined
    if (!authResponse) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const { user, token } = authResponse;

    // Return the user and token
    res.json({ message: "Login successful", user, token });
  } catch (error: any) {
    console.error("Error logging in user:", error);

    // Handle specific error cases
    if (error instanceof MainAppError) {
      res.status(error.httpcode).json({ error: error.message });
    } else {
      res
        .status(HTTPCODES.INTERNAL_SERVER_ERROR)
        .json({ error: "An error occurred while logging in" });
    }
  }
};

// Regenerate OTP Controller
export const regenerateOtpController = async (req: Request, res: Response) => {
  const { userId } = req.params; // Expecting userId request params
  const { email } = req.body; // Expecting userId and email in the request body

  if (!userId || !email) {
    return res.status(400).json({ error: "User ID and email are required." });
  }

  try {
    const newOtp = await regenerateOTP(userId, email);
    res
      .status(200)
      .json({ message: "New OTP sent successfully.", otp: newOtp });
  } catch (error) {
    console.error("Error regenerating OTP:", error);
    res
      .status(500)
      .json({ error: "Failed to regenerate OTP. Please try again later." });
  }
};
