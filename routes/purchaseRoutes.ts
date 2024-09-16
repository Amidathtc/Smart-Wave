import { Router } from "express";
import {
  purchaseProductController,
  getAllPurchasesController,
  getPurchasesByUserIdController,
  getPurchaseByIdController,
} from "../controllers/purchaseController";

const router = Router();

// Route to purchase a product
router.post("/purchase", purchaseProductController);

// Route to get all purchases
router.get("/", getAllPurchasesController);

// Route to get purchases by user ID
router.get("/user/:userId", getPurchasesByUserIdController);

// Route to get purchase by ID
router.get("/:purchaseId", getPurchaseByIdController);

export default router;
