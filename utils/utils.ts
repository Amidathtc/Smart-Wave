import nodemailer from "nodemailer";
import { db } from "../config/firebase"; // Ensure you have Firestore configured
import { doc, setDoc, getDoc } from "firebase/firestore";

// Define OTP expiration time (5 minutes)
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email: string, userId: string): Promise<void> => {
  const otp = generateOTP();

  // Store OTP in Firestore with expiration
  const otpDocRef = doc(db, "otps", userId); // Using userId as the document ID
  const otpData = {
    otp,
    createdAt: new Date().getTime(),
  };

  // Store the OTP in Firestore
  await setDoc(otpDocRef, otpData);

  // Validate environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Email configuration is not set in environment variables.");
  }

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  // Define mail options
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Your OTP for Verification",
    text: `Your OTP is: ${otp}\n\nPlease use this OTP to complete your verification process.`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email. Please try again later.");
  }
};


// Function to validate the OTP
export const validateOTP = async (userId: string, inputOtp: string): Promise<boolean> => {
  const otpDocRef = doc(db, "otps", userId);
  const otpDoc = await getDoc(otpDocRef);

  if (otpDoc.exists()) {
    const { otp, createdAt } = otpDoc.data();
    const currentTime = new Date().getTime();

    console.log("otp",otp)
    console.log("otpInput",inputOtp)
    // Check if the OTP matches and is still valid
    if (otp === inputOtp && (currentTime - createdAt) < OTP_EXPIRATION_TIME) {
      // OTP is valid
      return true;
    }
  }
  // OTP is invalid or expired
  return false;
};
