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
exports.getAVendorByIdController = exports.getAllVendorsController = exports.getVendorDashboardController = void 0;
const vendorsModel_1 = require("../models/vendorsModel");
// Get Vendor Dashboard Data
const getVendorDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.params; // Extract vendorId from request parameters
    try {
        const earnings = yield (0, vendorsModel_1.getVendorEarnings)(vendorId);
        const products = yield (0, vendorsModel_1.getVendorProducts)(vendorId);
        const salesHistory = yield (0, vendorsModel_1.getVendorSalesHistory)(vendorId);
        const transactionHistory = yield (0, vendorsModel_1.getVendorTransactionHistory)(vendorId);
        // Calculate total earnings and other metrics
        const totalEarnings = earnings.totalEarnings || 0;
        const unpaidEarnings = earnings.unpaidEarnings || 0;
        const paidEarnings = totalEarnings - unpaidEarnings;
        const totalSales = salesHistory.length;
        const registrationEarnings = earnings.registrationEarnings || 0;
        const referralEarnings = earnings.referralEarnings || 0;
        const bonusEarnings = earnings.bonusEarnings || 0;
        res.status(200).json({
            totalEarnings,
            unpaidEarnings,
            paidEarnings,
            totalSales,
            registrationEarnings,
            referralEarnings,
            bonusEarnings,
            products,
            salesHistory,
            transactionHistory,
        });
    }
    catch (error) {
        console.error("Error retrieving vendor dashboard data:", error);
        res.status(500).json({
            error: "Failed to retrieve vendor dashboard data. Please try again later.",
        });
    }
});
exports.getVendorDashboardController = getVendorDashboardController;
// Get all vendors
const getAllVendorsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield (0, vendorsModel_1.getAllVendors)();
        res.status(200).json(vendors);
    }
    catch (error) {
        console.error("Error retrieving vendors:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve vendors. Please try again later." });
    }
});
exports.getAllVendorsController = getAllVendorsController;
// Get a vendor by ID
const getAVendorByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.params; // Extract vendorId from request parameters
    try {
        const vendor = yield (0, vendorsModel_1.getVendorById)(vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }
        res.status(200).json(vendor);
    }
    catch (error) {
        console.error("Error retrieving vendor:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve vendor. Please try again later." });
    }
});
exports.getAVendorByIdController = getAVendorByIdController;
