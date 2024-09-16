import { Router } from "express";
import {
  createWithdrawalController,
  approveWithdrawalController,
  getAllWithdrawalsController,
  getAUserWithdrawalsController,
  getAWithdrawalByIdController,
  getPendingWithdrawalsController,
} from "../controllers/withdrawalController";

const router: Router = Router();

// Route to create a withdrawal request
router.post("/withdrawal-request", createWithdrawalController);

// Route to approve or reject a withdrawal request
router.post("/approve/:userId", approveWithdrawalController);

// Route to get all withdrawals
router.get("/withdrawals", getAllWithdrawalsController);

// Route to get withdrawals for a user
router.get("/user/:userId", getAUserWithdrawalsController);

// Route to get a withdrawal by ID
router.get("/withdrawal/:withdrawalId", getAWithdrawalByIdController);

// Route to get pending withdrawals
router.get("/pending-withdrawals", getPendingWithdrawalsController);

export default router;
