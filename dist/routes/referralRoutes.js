"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referralController_1 = require("../controllers/referralController");
const router = (0, express_1.Router)();
// Route to refer to earn
router.post('/refer-to-earn', referralController_1.referToEarnController);
// Route to get referral history
router.get('/history/:userId', referralController_1.getReferralHistoryController);
// Route to share referral link
router.get('/share/:userId', referralController_1.shareReferralLinkController);
// Route to add a referral
router.post('/add', referralController_1.addReferralController);
// Route to get referrals by user ID
router.get('/referrals/:userId', referralController_1.getReferralsController);
exports.default = router;
