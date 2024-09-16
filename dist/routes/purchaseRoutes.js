"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const router = (0, express_1.Router)();
// Route to purchase a product
router.post("/purchase", purchaseController_1.purchaseProductController);
// Route to get all purchases
router.get("/", purchaseController_1.getAllPurchasesController);
// Route to get purchases by user ID
router.get("/user/:userId", purchaseController_1.getPurchasesByUserIdController);
// Route to get purchase by ID
router.get("/:purchaseId", purchaseController_1.getPurchaseByIdController);
exports.default = router;
