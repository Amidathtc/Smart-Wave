import { Request, Response } from "express";
import {
  getAllVendors,
  getVendorById,
  getVendorEarnings,
  getVendorProducts,
  getVendorSalesHistory,
  getVendorTransactionHistory,
} from "../models/vendorsModel";

// Get Vendor Dashboard Data
export const getVendorDashboardController = async (
  req: Request,
  res: Response
) => {
  const { vendorId } = req.params; // Extract vendorId from request parameters

  try {
    const earnings: any = await getVendorEarnings(vendorId);
    const products = await getVendorProducts(vendorId);
    const salesHistory = await getVendorSalesHistory(vendorId);
    const transactionHistory = await getVendorTransactionHistory(vendorId);

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
  } catch (error) {
    console.error("Error retrieving vendor dashboard data:", error);
    res.status(500).json({
      error:
        "Failed to retrieve vendor dashboard data. Please try again later.",
    });
  }
};

// Get all vendors
export const getAllVendorsController = async (req: Request, res: Response) => {
  try {
    const vendors = await getAllVendors();
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error retrieving vendors:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve vendors. Please try again later." });
  }
};

// Get a vendor by ID
export const getAVendorByIdController = async (req: Request, res: Response) => {
  const { vendorId } = req.params; // Extract vendorId from request parameters

  try {
    const vendor = await getVendorById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error retrieving vendor:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve vendor. Please try again later." });
  }
};
