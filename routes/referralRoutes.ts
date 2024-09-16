import { Router } from 'express';
import { referToEarnController, getReferralHistoryController, shareReferralLinkController, addReferralController, getReferralsController } from '../controllers/referralController';

const router = Router();

// Route to refer to earn
router.post('/refer-to-earn', referToEarnController);

// Route to get referral history
router.get('/history/:userId', getReferralHistoryController);

// Route to share referral link
router.get('/share/:userId', shareReferralLinkController);

// Route to add a referral
router.post('/add', addReferralController);

// Route to get referrals by user ID
router.get('/referrals/:userId', getReferralsController);

export default router;