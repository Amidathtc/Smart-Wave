"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessController_1 = require("../controllers/businessController");
const router = (0, express_1.Router)();
router.post("/register-business", businessController_1.registerBusinessController);
exports.default = router;
