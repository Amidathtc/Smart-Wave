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
exports.getVendorById = exports.getAllVendors = exports.getVendorTransactionHistory = exports.getVendorSalesHistory = exports.getVendorProducts = exports.getVendorEarnings = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Get total earnings and other metrics for a vendor
const getVendorEarnings = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "vendors", vendorId));
    return vendorDoc.exists() ? vendorDoc.data() : null;
});
exports.getVendorEarnings = getVendorEarnings;
// Get products for a vendor
const getVendorProducts = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const productsRef = (0, firestore_1.collection)(firebase_1.db, "products");
    const q = (0, firestore_1.query)(productsRef, (0, firestore_1.where)("vendorId", "==", vendorId));
    const productsSnapshot = yield (0, firestore_1.getDocs)(q);
    return productsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getVendorProducts = getVendorProducts;
// Get sales history for a vendor
const getVendorSalesHistory = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const salesRef = (0, firestore_1.collection)(firebase_1.db, "sales");
    const q = (0, firestore_1.query)(salesRef, (0, firestore_1.where)("vendorId", "==", vendorId));
    const salesSnapshot = yield (0, firestore_1.getDocs)(q);
    return salesSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getVendorSalesHistory = getVendorSalesHistory;
// Get transaction history for a vendor
const getVendorTransactionHistory = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsRef = (0, firestore_1.collection)(firebase_1.db, "transactions");
    const q = (0, firestore_1.query)(transactionsRef, (0, firestore_1.where)("vendorId", "==", vendorId));
    const transactionsSnapshot = yield (0, firestore_1.getDocs)(q);
    return transactionsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getVendorTransactionHistory = getVendorTransactionHistory;
// Get all vendors
const getAllVendors = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersRef = (0, firestore_1.collection)(firebase_1.db, "users");
    const q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("role", "==", "vendor"));
    const vendorsSnapshot = yield (0, firestore_1.getDocs)(q);
    return vendorsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllVendors = getAllVendors;
// Get a vendor by ID
const getVendorById = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", vendorId));
    return vendorDoc.exists() ? vendorDoc.data() : null;
});
exports.getVendorById = getVendorById;
