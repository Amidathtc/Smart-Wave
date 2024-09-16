import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  validateOTP,
} from "../utils/emailUtils";
import { HTTPCODES } from "../utils/HTTPCODES";
import {
  hashPassword,
  comparePasswords,
  generateAccessToken,
} from "../utils/authUtils";
import { UserData } from "../utils/interface";
import nodemailer from "nodemailer";
import { MainAppError } from "../utils/errorUtils";
import dotenv from "dotenv";

dotenv.config();

// Affiliate Registration
export const registerAffiliate = async (data: any) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create user with Firebase Authentication using the plain password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password // Use the plain password for Firebase Authentication
    );

    const userReferralCode =
      data.referralCode || generateReferralCode(userCredential.user.uid);

    // Generate OTP
    const otp = generateOTP();

    // Store user data in Firestore, including the hashed password and additional fields
    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName: data.fullName,
      email: data.email,
      role: "affiliate",
      referralCode: userReferralCode,
      wallet: { balance: 0 },
      password: hashedPassword, // Store the hashed password
      registrationFeeStatus: "pending", // Initial registration fee status
      purchases: [], // Initialize purchases as an empty array
      earnings: {
        totalUnpaidEarnings: 0,
        totalEarnings: 0,
        paidEarnings: 0,
        registrationEarnings: 0,
        referralEarnings: 0,
        bonusEarnings: 0,
      },
      withdrawals: [], // Initialize withdrawals as an empty array
      deposits: [], // Initialize deposits as an empty array
      transactions: [], // Initialize transactions as an empty array
      verified: false, // Set initial verification status
    });

    // Store OTP in Firestore
    await storeOTP(userCredential.user.uid, otp);

    // Send OTP email
    await sendOTPEmail(data.email, otp);

    // Return the user credential
    return userCredential.user;
  } catch (error: any) {
    handleAuthError(error);
  }
};
// the forge
// Alien: romulus
// blink twice
// it ends with us
// Vendor Registration
export const registerVendor = async (data: UserData) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create user with Firebase Authentication using the plain password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password // Use the plain password for Firebase Authentication
    );

    const otp = generateOTP();
    const userReferralCode =
      data.referralCode || generateReferralCode(userCredential.user.uid);

    // Store user data in Firestore, including the hashed password and additional fields
    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName: data.fullName,
      email: data.email,
      role: "vendor",
      referralCode: userReferralCode,
      wallet: { balance: 0 },
      password: hashedPassword, // Store the hashed password
      registrationFeeStatus: "pending", // Initial registration fee status
      purchases: [], // Initialize purchases as an empty array
      sales: [], // Initialize sales as an empty array
      earnings: {
        totalUnpaidEarnings: 0,
        totalEarnings: 0,
        paidEarnings: 0,
        totalSales: 0,
        registrationEarnings: 0,
        referralEarnings: 0,
        bonusEarnings: 0,
      },
      withdrawals: [], // Initialize withdrawals as an empty array
      deposits: [], // Initialize deposits as an empty array
      transactions: [], // Initialize transactions as an empty array
      verified: false, // Set initial verification status
    });

    // Store OTP in Firestore
    await storeOTP(userCredential.user.uid, otp);

    // Send OTP email
    await sendOTPEmail(data.email, otp);

    // Return the user credential
    return userCredential.user;
  } catch (error: any) {
    handleAuthError(error);
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new MainAppError({
      message: "Failed to retrieve users",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getUserById = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new MainAppError({
        message: "User not found",
        httpcode: HTTPCODES.NOT_FOUND,
      });
    }
    return userDoc.data();
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new MainAppError({
      message: "Failed to retrieve user data",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};
// Check if user is a vendor or admin
export const isVendorOrAdmin = async (userId: string): Promise<boolean> => {
  const user = await getUserById(userId);
  return user?.role === "vendor" || user?.role === "admin";
};

export const getUserByEmail = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      console.log("User not found by email:", email);
      return null;
    }

    const userDoc = userSnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new MainAppError({
      message: "Failed to retrieve user data",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const verifyEmailToken = async (email: string, otp: string) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new MainAppError({
        message: "User not found",
        httpcode: HTTPCODES.NOT_FOUND,
      });
    }

    const userId = user.id;
    const isValid = await validateOTP(userId, otp);

    if (isValid) {
      await updateDoc(doc(db, "users", userId), { verified: true });
      await sendVerificationConfirmationEmail(email);
      return { message: "Email verified successfully" };
    } else {
      throw new MainAppError({
        message: "Invalid OTP or user not found",
        httpcode: HTTPCODES.BAD_REQUEST,
      });
    }
  } catch (error: any) {
    console.error("Error verifying email:", error);
    throw new MainAppError({
      message: "Error verifying email token",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    // Retrieve the user from Firestore
    const user: any = await getUserByEmail(email);

    // Check if user exists
    if (!user) {
      throw new MainAppError({
        message: "Invalid email or password",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }

    // Compare the inputted password with the hashed password
    const isPasswordValid = await comparePasswords(password, user?.password);

    if (!isPasswordValid) {
      throw new MainAppError({
        message: "Invalid email or password",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }

    // Check if the user is verified
    if (!user?.verified) {
      throw new MainAppError({
        message: "Please verify your email before logging in",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }

    // Authenticate the user with Firebase (this step is optional if you're managing authentication through Firestore)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userFirebase = userCredential.user; // Get the user object from Firebase
    const token = await getIdToken(userFirebase); // Get the ID token

    // Return the user and token
    return { user: userFirebase, token };
  } catch (error: any) {
    console.error("Error authenticating user:", error);
    throw new MainAppError({
      message: "An error occurred while authenticating the user",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

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

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

// Update user wallet balance
export const updateUserWallet = async (userId: string, newBalance: number) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { walletBalance: newBalance });
};

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

// Helper Functions
const generateReferralCode = (userId: string) => {
  return `REF-${userId.substring(0, 8).toUpperCase()}`;
};

const handleAuthError = (error: any) => {
  if (error.code === "auth/email-already-in-use") {
    throw new MainAppError({
      message: "Email already in use",
      httpcode: HTTPCODES.BAD_REQUEST,
    });
  } else if (error.code === "auth/invalid-email") {
    throw new MainAppError({
      message: "Invalid email address",
      httpcode: HTTPCODES.BAD_REQUEST,
    });
  } else if (error.code === "auth/weak-password") {
    throw new MainAppError({
      message: "Password should be at least 6 characters",
      httpcode: HTTPCODES.BAD_REQUEST,
    });
  } else if (error.code === "auth/network-request-failed") {
    throw new MainAppError({
      message: "Network error: Please check your internet connection.",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  } else {
    console.error("Error adding user:", error);
    throw new MainAppError({
      message: "An error occurred while adding the user",
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    });
  }
};

const sendVerificationConfirmationEmail = async (email: string) => {
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
    subject: "Account Verification Successful",
    text: `Your account has been successfully verified.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification confirmation email:", error);
    throw new Error(
      "Failed to send verification confirmation email. Please try again later."
    );
  }
};

export const updateUserPassword = async (
  email: string,
  newPassword: string
) => {
  const user = await signInWithEmailAndPassword(auth, email, newPassword); // Ensure user is authenticated
  await updatePassword(user.user, newPassword);
};

export const storeUserPin = async (userId: string, pin: string) => {
  await setDoc(
    doc(db, "users", userId),
    { transactionPin: pin },
    { merge: true }
  );
};

export const uploadBankDetails = async (userId: string, bankDetails: any) => {
  await setDoc(doc(db, "bankDetails", userId), bankDetails);
};

export const updateUserPin = async (userId: string, pin: string) => {
  await setDoc(
    doc(db, "users", userId),
    { transactionPin: pin },
    { merge: true }
  );
};
