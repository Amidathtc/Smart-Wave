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
exports.getAffiliateDashboardController = exports.getAnAffiliateByIdController = exports.getAllAffiliatesController = void 0;
const affiliateModel_1 = require("../models/affiliateModel");
// Get all affiliates
const getAllAffiliatesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const affiliates = yield (0, affiliateModel_1.getAllAffiliates)();
        res.status(200).json(affiliates);
    }
    catch (error) {
        console.error("Error retrieving affiliates:", error);
        res.status(500).json({
            error: "Failed to retrieve affiliates. Please try again later.",
        });
    }
});
exports.getAllAffiliatesController = getAllAffiliatesController;
// Get an affiliate by ID
const getAnAffiliateByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { affiliateId } = req.params; // Extract affiliateId from request parameters
    try {
        const affiliate = yield (0, affiliateModel_1.getAffiliateById)(affiliateId);
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate not found." });
        }
        res.status(200).json(affiliate);
    }
    catch (error) {
        console.error("Error retrieving affiliate:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve affiliate. Please try again later." });
    }
});
exports.getAnAffiliateByIdController = getAnAffiliateByIdController;
const getAffiliateDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { affiliateId } = req.params; // Extract affiliateId from request parameters
    try {
        // Retrieve earnings, referrals, and transaction history for the affiliate
        const earnings = yield (0, affiliateModel_1.getAffiliateEarnings)(affiliateId);
        const referrals = yield (0, affiliateModel_1.getAffiliateReferrals)(affiliateId);
        const transactionHistory = yield (0, affiliateModel_1.getAffiliateTransactionHistory)(affiliateId);
        // Calculate total earnings and other metrics
        const totalEarnings = earnings.totalEarnings || 0;
        const unpaidEarnings = earnings.unpaidEarnings || 0;
        const paidEarnings = totalEarnings - unpaidEarnings;
        const totalReferrals = referrals.length;
        const referralEarnings = earnings.referralEarnings || 0;
        const bonusEarnings = earnings.bonusEarnings || 0;
        // Construct the response object
        const responseData = {
            totalEarnings,
            unpaidEarnings,
            paidEarnings,
            totalReferrals,
            referralEarnings,
            bonusEarnings,
            referrals,
            transactionHistory,
        };
        // Send the response
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error retrieving affiliate dashboard data:", error);
        res.status(500).json({
            error: "Failed to retrieve affiliate dashboard data. Please try again later.",
        });
    }
});
exports.getAffiliateDashboardController = getAffiliateDashboardController;
