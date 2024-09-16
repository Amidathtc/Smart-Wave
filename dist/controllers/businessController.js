"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBusinessController = void 0;
const businessModel_1 = require("../models/businessModel");
const registerBusinessController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, name, userId } = req.body;
    try {
        const businessId = yield (0, businessModel_1.registerBusiness)({ type, name, userId });
        res.json({ businessId });
    }
    catch (error) {
        console.error("Register business error:", error);
        res.status(500).json({ error: "An error occurred while registering the business" });
    }
});
exports.registerBusinessController = registerBusinessController;
