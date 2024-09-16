import { Router } from "express";
import {
  getAllVendorsController,
  getAVendorByIdController,
  getVendorDashboardController,
} from "../controllers/vendorsController";

const router: Router = Router();

// Route to get vendor dashboard data
router.get("/dashboard/:vendorId", getVendorDashboardController);
// Route to get all vendors
router.get("/vendors", getAllVendorsController);

// Route to get a vendor by ID
router.get("/vendor/:vendorId", getAVendorByIdController);

export default router;
