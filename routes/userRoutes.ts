import { Router } from "express";
import {
  getUsers,
  getUser,
  getUserByEmailEndpoint,
  updateStatus,
  setTransactionPinController,
  updatePasswordController,
  uploadBankDetailsController,
} from "../controllers/userController";
import {
  changePinController,
  editProfile,
  forgotPinController,
  sendVerificationOTP,
  verifyPhoneNumber,
} from "../controllers/userProfileController";

const router: Router = Router();

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.get("/user-by-email/:email", getUserByEmailEndpoint);
router.put("/user/:id/status", updateStatus);
router.put("/profile/:userId", editProfile); // Update user profile
router.post("/verify-otp", sendVerificationOTP); // Send OTP for phone verification
router.post("/verify-phone", verifyPhoneNumber); // Verify phone number with OTP
// Route to update/change password
router.post("/update-password", updatePasswordController);

// Route to set transaction pin
router.post("/set-pin/:userId", setTransactionPinController);

// Route to upload bank details
router.post("/upload-bank-details/:userId", uploadBankDetailsController);

// Route to change transaction PIN
router.post("/change-pin/:userId", changePinController);

// Route to handle forgot PIN
router.post("/forgot-pin", forgotPinController);

export default router;
