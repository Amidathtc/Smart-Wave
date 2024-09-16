import { Request, Response } from "express";
import {
  getAllEarnings,
  getUserEarnings,
  getEarningsByCategory,
  getEarningById,
} from "../models/earningsModel";

// Get all earnings
export const getAllEarningsController = async (req: Request, res: Response) => {
  try {
    const earnings = await getAllEarnings();
    res.status(200).json(earnings);
  } catch (error) {
    console.error("Error retrieving all earnings:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve earnings. Please try again later." });
  }
};

// Get earnings for a specific user
export const getUserEarningsController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    const earnings = await getUserEarnings(userId);
    res.status(200).json(earnings);
  } catch (error) {
    console.error("Error retrieving user earnings:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve user earnings. Please try again later.",
      });
  }
};

// Get earnings by category
export const getEarningsByCategoryController = async (
  req: Request,
  res: Response
) => {
  const { category } = req.params; // Extract category from request parameters

  try {
    const earnings = await getEarningsByCategory(category);
    res.status(200).json(earnings);
  } catch (error) {
    console.error("Error retrieving earnings by category:", error);
    res
      .status(500)
      .json({
        error:
          "Failed to retrieve earnings by category. Please try again later.",
      });
  }
};

// Get earnings by ID
export const getEarningByIdController = async (req: Request, res: Response) => {
  const { earningId } = req.params; // Extract earningId from request parameters

  try {
    const earning = await getEarningById(earningId);
    if (!earning) {
      return res.status(404).json({ error: "Earning not found." });
    }
    res.status(200).json(earning);
  } catch (error) {
    console.error("Error retrieving earning by ID:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve earning by ID. Please try again later.",
      });
  }
};
