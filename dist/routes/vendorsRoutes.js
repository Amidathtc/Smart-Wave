"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendorsController_1 = require("../controllers/vendorsController");
const router = (0, express_1.Router)();
// Route to get vendor dashboard data
router.get("/dashboard/:vendorId", vendorsController_1.getVendorDashboardController);
// Route to get all vendors
router.get("/vendors", vendorsController_1.getAllVendorsController);
// Route to get a vendor by ID
router.get("/vendor/:vendorId", vendorsController_1.getAVendorByIdController);
exports.default = router;
