import { Request, Response } from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchasesByUserId,
  getPurchaseById,
} from "../models/purchaseModel";
import { getProductById, updateProductQuantity } from "../models/productModel";
import { getUserById, updateUserWallet } from "../models/userModel";

// Purchase a product
export const purchaseProductController = async (
  req: Request,
  res: Response
) => {
  const { userId, productId, quantity, name, email } = req.body;

  if (!userId || !productId || !quantity || !name || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await getUserById(userId);
    const product = await getProductById(productId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (quantity > product.quantity) {
      return res
        .status(400)
        .json({ error: "Quantity exceeds available stock." });
    }

    const totalCost = product.price * quantity;

    if (user.walletBalance < totalCost) {
      return res.status(400).json({ error: "Insufficient wallet balance." });
    }

    // Deduct from user wallet
    const newBalance = user.walletBalance - totalCost;
    await updateUserWallet(userId, newBalance);

    // Update product quantity
    const newQuantity = product.quantity - quantity;
    await updateProductQuantity(productId, newQuantity);

    // Create purchase record
    const purchaseId = await createPurchase({
      userId,
      productId,
      quantity,
      name,
      email,
      totalCost,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Purchase successful.", purchaseId });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res
      .status(500)
      .json({ error: "Failed to process purchase. Please try again later." });
  }
};

// Get all purchases
export const getAllPurchasesController = async (
  req: Request,
  res: Response
) => {
  try {
    const purchases = await getAllPurchases();
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve purchases. Please try again later." });
  }
};

// Get purchases by user ID
export const getPurchasesByUserIdController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  try {
    const purchases = await getPurchasesByUserId(userId);
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error retrieving user purchases:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve user purchases. Please try again later.",
      });
  }
};

// Get purchase by ID
export const getPurchaseByIdController = async (
  req: Request,
  res: Response
) => {
  const { purchaseId } = req.params;

  try {
    const purchase = await getPurchaseById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found." });
    }
    res.status(200).json(purchase);
  } catch (error) {
    console.error("Error retrieving purchase:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve purchase. Please try again later." });
  }
};
