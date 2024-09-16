"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userProfileController_1 = require("../controllers/userProfileController");
const router = (0, express_1.Router)();
router.get("/users", userController_1.getUsers);
router.get("/user/:id", userController_1.getUser);
router.get("/user-by-email/:email", userController_1.getUserByEmailEndpoint);
router.put("/user/:id/status", userController_1.updateStatus);
router.put("/profile/:userId", userProfileController_1.editProfile); // Update user profile
router.post("/verify-otp", userProfileController_1.sendVerificationOTP); // Send OTP for phone verification
router.post("/verify-phone", userProfileController_1.verifyPhoneNumber); // Verify phone number with OTP
// Route to update/change password
router.post("/update-password", userController_1.updatePasswordController);
// Route to set transaction pin
router.post("/set-pin/:userId", userController_1.setTransactionPinController);
// Route to upload bank details
router.post("/upload-bank-details/:userId", userController_1.uploadBankDetailsController);
// Route to change transaction PIN
router.post("/change-pin/:userId", userProfileController_1.changePinController);
// Route to handle forgot PIN
router.post("/forgot-pin", userProfileController_1.forgotPinController);
exports.default = router;
