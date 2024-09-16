import crypto from "crypto";

const OTP_LENGTH = 4;

export const generateOTP = (): string => {
  return crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");
};

// You can store the OTP in-memory or in Firestore for verification
const otps: Record<string, string> = {}; // In-memory storage for demonstration

export const sendOTP = (phoneNumber: string): string => {
  const otp = generateOTP();
  otps[phoneNumber] = otp; // Store OTP
  // Here you would integrate with an SMS service to send the OTP
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  return otp;
};

export const verifyOTP = (phoneNumber: string, otp: string): boolean => {
  return otps[phoneNumber] === otp;
};
