import crypto from "crypto";
import nodemailer from "nodemailer";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import dotenv from "dotenv";

dotenv.config();

const OTP_LENGTH = 6; // Standardize OTP length
const OTP_EXPIRATION_TIME = 1 * 60 * 1000; // 1 minute in milliseconds

// Generate a secure OTP
export const generateOTP = (): string => {
  return crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");
};

// Send OTP via email
export const sendOTPEmail = async (email: string, otp: string) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Email configuration is not set in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Your OTP for Verification",
    text: `Your OTP is: ${otp}\n\nPlease use this OTP to complete your verification process.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email. Please try again later.");
  }
};

// Store OTP in Firestore
export const storeOTP = async (userId: string, otp: string) => {
  await setDoc(doc(db, "otps", userId), {
    otp,
    createdAt: new Date().getTime(),
  });
};

// Validate OTP
export const validateOTP = async (
  userId: string,
  inputOtp: string
): Promise<boolean> => {
  const otpDocRef = doc(db, "otps", userId);
  const otpDoc = await getDoc(otpDocRef);

  if (otpDoc.exists()) {
    const { otp, createdAt } = otpDoc.data();
    const currentTime = new Date().getTime();

    // Check if the OTP matches and is still valid
    if (otp === inputOtp && currentTime - createdAt < OTP_EXPIRATION_TIME) {
      // OTP is valid
      return true;
    }
  }
  // OTP is invalid or expired
  return false;
};

// Regenerate OTP
export const regenerateOTP = async (
  userId: string,
  email: string
): Promise<string> => {
  const newOtp = generateOTP();
  await storeOTP(userId, newOtp); // Store the new OTP in Firestore
  await sendOTPEmail(email, newOtp); // Send the new OTP via email
  return newOtp; // Return the new OTP
};

// Main function to send OTP
export const sendOTP = async (userId: string, email: string): Promise<void> => {
  const otp = generateOTP();
  await storeOTP(userId, otp); // Store OTP in Firestore
  await sendOTPEmail(email, otp); // Send OTP via email
};
