import { Router } from "express";
import {
  getAllAffiliatesController,
  getAnAffiliateByIdController,
} from "../controllers/affiliateController";

const router: Router = Router();

// Route to get all affiliates
router.get("/affiliates", getAllAffiliatesController);

// Route to get an affiliate by ID
router.get("/affiliate/:affiliateId", getAnAffiliateByIdController);

export default router;
