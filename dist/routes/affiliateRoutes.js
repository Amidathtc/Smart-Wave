"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const affiliateController_1 = require("../controllers/affiliateController");
const router = (0, express_1.Router)();
// Route to get all affiliates
router.get("/affiliates", affiliateController_1.getAllAffiliatesController);
// Route to get an affiliate by ID
router.get("/affiliate/:affiliateId", affiliateController_1.getAnAffiliateByIdController);
exports.default = router;
