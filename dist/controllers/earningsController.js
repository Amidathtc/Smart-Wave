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
exports.getEarningByIdController = exports.getEarningsByCategoryController = exports.getUserEarningsController = exports.getAllEarningsController = void 0;
const earningsModel_1 = require("../models/earningsModel");
// Get all earnings
const getAllEarningsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const earnings = yield (0, earningsModel_1.getAllEarnings)();
        res.status(200).json(earnings);
    }
    catch (error) {
        console.error("Error retrieving all earnings:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve earnings. Please try again later." });
    }
});
exports.getAllEarningsController = getAllEarningsController;
// Get earnings for a specific user
const getUserEarningsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Extract userId from request parameters
    try {
        const earnings = yield (0, earningsModel_1.getUserEarnings)(userId);
        res.status(200).json(earnings);
    }
    catch (error) {
        console.error("Error retrieving user earnings:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve user earnings. Please try again later.",
        });
    }
});
exports.getUserEarningsController = getUserEarningsController;
// Get earnings by category
const getEarningsByCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params; // Extract category from request parameters
    try {
        const earnings = yield (0, earningsModel_1.getEarningsByCategory)(category);
        res.status(200).json(earnings);
    }
    catch (error) {
        console.error("Error retrieving earnings by category:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve earnings by category. Please try again later.",
        });
    }
});
exports.getEarningsByCategoryController = getEarningsByCategoryController;
// Get earnings by ID
const getEarningByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { earningId } = req.params; // Extract earningId from request parameters
    try {
        const earning = yield (0, earningsModel_1.getEarningById)(earningId);
        if (!earning) {
            return res.status(404).json({ error: "Earning not found." });
        }
        res.status(200).json(earning);
    }
    catch (error) {
        console.error("Error retrieving earning by ID:", error);
        res
            .status(500)
            .json({
            error: "Failed to retrieve earning by ID. Please try again later.",
        });
    }
});
exports.getEarningByIdController = getEarningByIdController;
