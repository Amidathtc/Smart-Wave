import express, { Router } from "express";
import {
  registerUser,
  verifyEmail,
  sendVerification,
  loginUser,
  regenerateOtpController,
} from "../controllers/authController";

const router: Router = Router();

router.post("/add-user", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/send-verification-email", sendVerification);
router.post("/login", loginUser);
router.post("/regenerate-otp", regenerateOtpController);

export default router;
