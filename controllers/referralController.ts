import { Request, Response } from 'express';
import { storeReferralData, addReferral, getReferralsByUserId, getReferralData, updateReferralEarnings } from '../models/referralModel';


// Refer to Earn
export const referToEarnController = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: 'User ID and amount are required.' });
  }

  try {
    // Update referral earnings
    await updateReferralEarnings(userId, amount);
    res.status(200).json({ message: 'Referral earnings updated successfully.' });
  } catch (error) {
    console.error('Error updating referral earnings:', error);
    res.status(500).json({ error: 'Failed to update referral earnings. Please try again later.' });
  }
};

// Get Referral History
export const getReferralHistoryController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const referralData = await getReferralData(userId);
    if (!referralData) {
      return res.status(404).json({ error: 'Referral data not found.' });
    }
    res.status(200).json(referralData);
  } catch (error) {
    console.error('Error retrieving referral history:', error);
    res.status(500).json({ error: 'Failed to retrieve referral history. Please try again later.' });
  }
};

// Share Referral Link
export const shareReferralLinkController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const referralLink = `https://yourapp.com/referral/${userId}`; // Customize your referral link

  res.status(200).json({ referralLink });
};

// Add Referral
export const addReferralController = async (req: Request, res: Response) => {
  const { userId, referralCode } = req.body;
  try {
    const referralId = await addReferral({ userId, referralCode });
    res.json({ referralId });
  } catch (error) {
    console.error("Add referral error:", error);
    res.status(500).json({ error: "An error occurred while adding the referral" });
  }
};

// Get Referrals
export const getReferralsController = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const referrals = await getReferralsByUserId(userId);
    res.json(referrals);
  } catch (error) {
    console.error("Get referrals error:", error);
    res.status(500).json({ error: "An error occurred while fetching referrals" });
  }
};