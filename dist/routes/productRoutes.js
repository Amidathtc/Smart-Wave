"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileUpload_1 = require("../utils/fileUpload"); // Import the upload middleware
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
// Route to add a product (only accessible by vendors or admins)
router.post("/add-product/:userId", fileUpload_1.multerUpload, productController_1.addProductController);
// Route to update product approval (only accessible by admins)
router.post("/approve-product/:userId", productController_1.updateProductApprovalController);
// Route to get all products
router.get("/products", productController_1.getProductsController);
// Route to get a product by ID
router.get("/product/:productId", productController_1.getProductByIdController);
// Route to get products by category
router.get("/products/category/:category", productController_1.getProductsByCategoryController);
exports.default = router;
