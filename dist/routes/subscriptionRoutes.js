"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const router = (0, express_1.Router)();
router.post("/subscribe", subscriptionController_1.subscribe);
// , dashboard
// router.get("/dashboard", dashboard);
exports.default = router;
