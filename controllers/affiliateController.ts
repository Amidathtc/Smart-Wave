import { Request, Response } from "express";
import {
  getAllAffiliates,
  getAffiliateById,
  getAffiliateEarnings,
  getAffiliateReferrals,
  getAffiliateTransactionHistory,
} from "../models/affiliateModel";

// Get all affiliates
export const getAllAffiliatesController = async (
  req: Request,
  res: Response
) => {
  try {
    const affiliates = await getAllAffiliates();
    res.status(200).json(affiliates);
  } catch (error) {
    console.error("Error retrieving affiliates:", error);
    res.status(500).json({
      error: "Failed to retrieve affiliates. Please try again later.",
    });
  }
};

// Get an affiliate by ID
export const getAnAffiliateByIdController = async (
  req: Request,
  res: Response
) => {
  const { affiliateId } = req.params; // Extract affiliateId from request parameters

  try {
    const affiliate = await getAffiliateById(affiliateId);
    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate not found." });
    }
    res.status(200).json(affiliate);
  } catch (error) {
    console.error("Error retrieving affiliate:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve affiliate. Please try again later." });
  }
};

export const getAffiliateDashboardController = async (
  req: Request,
  res: Response
) => {
  const { affiliateId } = req.params; // Extract affiliateId from request parameters

  try {
    // Retrieve earnings, referrals, and transaction history for the affiliate
    const earnings: any = await getAffiliateEarnings(affiliateId);
    const referrals = await getAffiliateReferrals(affiliateId);
    const transactionHistory = await getAffiliateTransactionHistory(
      affiliateId
    );

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
  } catch (error) {
    console.error("Error retrieving affiliate dashboard data:", error);
    res.status(500).json({
      error:
        "Failed to retrieve affiliate dashboard data. Please try again later.",
    });
  }
};
