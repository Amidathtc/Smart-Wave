import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (inputPassword: string, hashedPassword: string) => {
  if (!hashedPassword) {
    throw new Error("Hashed password is undefined");
  }
  
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export const generateAccessToken = (user: any): string => {
  const payload = { userId: user.uid, email: user.email };
  const secretKey = process.env.JWT_SECRET!; // Ensure this is set in your environment variables
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secretKey, options);
};

