"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductApproval = exports.getProductsByCategory = exports.updateProductQuantity = exports.getProductById = exports.addProduct = exports.getAllProducts = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const productsRef = (0, firestore_1.collection)(firebase_1.db, "products");
    const productsSnapshot = yield (0, firestore_1.getDocs)(productsRef);
    const products = productsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
    return products;
});
exports.getAllProducts = getAllProducts;
// Add a product
const addProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const productDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, "products"));
    yield (0, firestore_1.setDoc)(productDocRef, product);
    return productDocRef.id;
});
exports.addProduct = addProduct;
// Get product by ID
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "products", productId));
    return productDoc.exists() ? productDoc.data() : null;
});
exports.getProductById = getProductById;
// Update product quantity after purchase
const updateProductQuantity = (productId, newQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    const productRef = (0, firestore_1.doc)(firebase_1.db, "products", productId);
    yield (0, firestore_1.updateDoc)(productRef, { quantity: newQuantity });
});
exports.updateProductQuantity = updateProductQuantity;
// Get products by category
const getProductsByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const productsRef = (0, firestore_1.collection)(firebase_1.db, "products");
    const q = (0, firestore_1.query)(productsRef, (0, firestore_1.where)("category", "==", category));
    const productsSnapshot = yield (0, firestore_1.getDocs)(q);
    return productsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getProductsByCategory = getProductsByCategory;
// Update product approval status
const updateProductApproval = (productId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const productRef = (0, firestore_1.doc)(firebase_1.db, "products", productId);
    yield (0, firestore_1.updateDoc)(productRef, { approvalStatus: status });
});
exports.updateProductApproval = updateProductApproval;
