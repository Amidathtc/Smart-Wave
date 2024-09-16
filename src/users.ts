import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { generateOTP, sendOTPEmail, validateOTP } from "../utils/utils";
import { HTTPCODES } from "../utils/HTTPCODES";
import { MainAppError } from "../utils/MainAppError";
import { hashPassword } from "../utils/auth";
import { UserData } from "../utils/interface";
import dotenv from 'dotenv';
dotenv.config();

// Function to add a new user to the authentication and Firestore
export const addUser = async (data: UserData) => {
  try {
    const hashedPassword = await hashPassword(data.password);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      hashedPassword
      
    );

    const otp = generateOTP();
    const userReferralCode = data.referralCode || generateReferralCode(userCredential.user.uid);

    // Store user data in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      referralCode: userReferralCode,
      wallet: { balance: 0 },
    });

    // Store OTP in a separate document
    await setDoc(doc(db, "otps", userCredential.user.uid), {
      otp,
      createdAt: new Date().getTime(),
    });

    // Send OTP email
    await sendOTPEmail(data.email, otp);
    return userCredential.user;
  } catch (error: any) {
    handleAuthError(error);
  }
};


export const getAllUsers = async (): Promise<any[]> => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to retrieve users");
  }
};

// Function to get user data by ID
export const getUserById = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new MainAppError({
        message: "User not found",
        httpcode: HTTPCODES.NOT_FOUND,
      });
    }
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new MainAppError({
      message: "Failed to retrieve user data",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Function to get user data by email
export const getUserByEmail = async (email: string) => {
  try {
    const usersRef = doc(db, "users", email);
    const userData = await getDoc(usersRef);
    return userData.exists() ? userData.data() : null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new MainAppError({
      message: "Failed to retrieve user data",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Function to verify the email token (OTP)
export const verifyEmailToken = async (email: string, otp: string) => {
  try {
    const userId = email; // Assuming you are using email as the user ID
    const isValid = await validateOTP(userId, otp);

    if (isValid) {
      // Proceed with marking the user as verified
      await updateDoc(doc(db, "users", userId), { verified: true });
      return { message: "Email verified successfully" };
    } else {
      throw new MainAppError({
        message: "Invalid OTP or user not found",
        httpcode: HTTPCODES.BAD_REQUEST,
      });
    }
  } catch (error:any) {
    console.error("Error verifying email:", error);
    throw new MainAppError({
      message: "Error verifying email token",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Function to update user status
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    await updateDoc(doc(db, "users", userId), { status });
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new MainAppError({
      message: "Failed to update user status",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Function to generate an access token for the user
export const generateAccessToken = async (user: any) => {
  try {
    return await getIdToken(user);
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new MainAppError({
      message: "Failed to generate access token",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Function to send a verification email to the user
export const sendVerificationEmail = async (email: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new MainAppError({
        message: "No user is currently signed in.",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }
    await sendEmailVerification(user);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new MainAppError({
      message: "Failed to send verification email",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Function to generate a referral code based on the user ID
const generateReferralCode = (userId: string) => {
  return `REF-${userId.substring(0, 8).toUpperCase()}`;
};

// Helper function to handle authentication errors
const handleAuthError = (error: any) => {
  if (error.code === "auth/email-already-in-use") {
    throw new MainAppError({
      message: "Email already in use",
      httpcode: HTTPCODES.BAD_REQUEST,
    });
  }
  console.error("Error adding user:", error);
  throw new MainAppError({
    message: "An error occurred while adding the user",
    httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
  });
};
