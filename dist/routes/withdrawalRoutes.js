"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawalController_1 = require("../controllers/withdrawalController");
const router = (0, express_1.Router)();
// Route to create a withdrawal request
router.post("/withdrawal-request", withdrawalController_1.createWithdrawalController);
// Route to approve or reject a withdrawal request
router.post("/approve/:userId", withdrawalController_1.approveWithdrawalController);
// Route to get all withdrawals
router.get("/withdrawals", withdrawalController_1.getAllWithdrawalsController);
// Route to get withdrawals for a user
router.get("/user/:userId", withdrawalController_1.getAUserWithdrawalsController);
// Route to get a withdrawal by ID
router.get("/withdrawal/:withdrawalId", withdrawalController_1.getAWithdrawalByIdController);
// Route to get pending withdrawals
router.get("/pending-withdrawals", withdrawalController_1.getPendingWithdrawalsController);
exports.default = router;
