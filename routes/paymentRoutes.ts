import { Router } from "express";
import {
  
  handlePaymentCallback,
  initiateRegistrationPayment,
  
} from "../controllers/paymentController"; // Adjust the import path as necessary

const router = Router();

// Route to initiate payment
router.post("/initiate/:userId", initiateRegistrationPayment);

// Route to handle payment callback
router.post("/callback", handlePaymentCallback);

export default router;
