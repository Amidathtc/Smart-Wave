"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const earningsController_1 = require("../controllers/earningsController");
const router = (0, express_1.Router)();
// Route to get all earnings
router.get("/earnings", earningsController_1.getAllEarningsController);
// Route to get earnings for a specific user
router.get("/user-earnings/:userId", earningsController_1.getUserEarningsController);
// Route to get earnings by category
router.get("/earnings-category/:category", earningsController_1.getEarningsByCategoryController);
// Route to get earnings by ID
router.get("/earning/:earningId", earningsController_1.getEarningByIdController);
exports.default = router;
