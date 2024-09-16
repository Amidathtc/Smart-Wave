import { Router } from "express";
import {
  getAllEarningsController,
  getUserEarningsController,
  getEarningsByCategoryController,
  getEarningByIdController,
} from "../controllers/earningsController";

const router: Router = Router();

// Route to get all earnings
router.get("/earnings", getAllEarningsController);

// Route to get earnings for a specific user
router.get("/user-earnings/:userId", getUserEarningsController);

// Route to get earnings by category
router.get("/earnings-category/:category", getEarningsByCategoryController);

// Route to get earnings by ID
router.get("/earning/:earningId", getEarningByIdController);

export default router;
