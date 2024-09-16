"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController"); // Adjust the import path as necessary
const router = (0, express_1.Router)();
// Route to initiate payment
router.post("/initiate/:userId", paymentController_1.initiateRegistrationPayment);
// Route to handle payment callback
router.post("/callback", paymentController_1.handlePaymentCallback);
exports.default = router;
