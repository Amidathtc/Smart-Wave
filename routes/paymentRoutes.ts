import { Router } from "express";
import {
  initiatePayment,
  paymentCallback,
} from "../controllers/paymentController"; // Adjust the import path as necessary

const router = Router();

// Route to initiate payment
router.post("/initiate/:userId", initiatePayment);

// Route to handle payment callback
router.post("/callback", paymentCallback);

export default router;
