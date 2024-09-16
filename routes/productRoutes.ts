import { Router } from "express";
import { multerUpload } from "../utils/fileUpload"; // Import the upload middleware
import {
  addProductController,
  getProductByIdController,
  getProductsByCategoryController,
  getProductsController,
  updateProductApprovalController,
} from "../controllers/productController";

const router = Router();

// Route to add a product (only accessible by vendors or admins)
router.post("/add-product/:userId", multerUpload, addProductController);

// Route to update product approval (only accessible by admins)
router.post("/approve-product/:userId", updateProductApprovalController);

// Route to get all products
router.get("/products", getProductsController);

// Route to get a product by ID
router.get("/product/:productId", getProductByIdController);

// Route to get products by category
router.get("/products/category/:category", getProductsByCategoryController);

export default router;
