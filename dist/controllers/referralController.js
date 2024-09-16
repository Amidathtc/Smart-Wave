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
exports.getReferralsController = exports.addReferralController = exports.shareReferralLinkController = exports.getReferralHistoryController = exports.referToEarnController = void 0;
const referralModel_1 = require("../models/referralModel");
// Refer to Earn
const referToEarnController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
        return res.status(400).json({ error: 'User ID and amount are required.' });
    }
    try {
        // Update referral earnings
        yield (0, referralModel_1.updateReferralEarnings)(userId, amount);
        res.status(200).json({ message: 'Referral earnings updated successfully.' });
    }
    catch (error) {
        console.error('Error updating referral earnings:', error);
        res.status(500).json({ error: 'Failed to update referral earnings. Please try again later.' });
    }
});
exports.referToEarnController = referToEarnController;
// Get Referral History
const getReferralHistoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
    try {
        const referralData = yield (0, referralModel_1.getReferralData)(userId);
        if (!referralData) {
            return res.status(404).json({ error: 'Referral data not found.' });
        }
        res.status(200).json(referralData);
    }
    catch (error) {
        console.error('Error retrieving referral history:', error);
        res.status(500).json({ error: 'Failed to retrieve referral history. Please try again later.' });
    }
});
exports.getReferralHistoryController = getReferralHistoryController;
// Share Referral Link
const shareReferralLinkController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
    const referralLink = `https://yourapp.com/referral/${userId}`; // Customize your referral link
    res.status(200).json({ referralLink });
});
exports.shareReferralLinkController = shareReferralLinkController;
// Add Referral
const addReferralController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, referralCode } = req.body;
    try {
        const referralId = yield (0, referralModel_1.addReferral)({ userId, referralCode });
        res.json({ referralId });
    }
    catch (error) {
        console.error("Add referral error:", error);
        res.status(500).json({ error: "An error occurred while adding the referral" });
    }
});
exports.addReferralController = addReferralController;
// Get Referrals
const getReferralsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const referrals = yield (0, referralModel_1.getReferralsByUserId)(userId);
        res.json(referrals);
    }
    catch (error) {
        console.error("Get referrals error:", error);
        res.status(500).json({ error: "An error occurred while fetching referrals" });
    }
});
exports.getReferralsController = getReferralsController;
