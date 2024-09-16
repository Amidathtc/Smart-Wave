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
exports.getPurchaseById = exports.getPurchasesByUserId = exports.getAllPurchases = exports.createPurchase = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Create a purchase
const createPurchase = (purchase) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, "purchases"));
    yield (0, firestore_1.setDoc)(purchaseDocRef, purchase);
    return purchaseDocRef.id;
});
exports.createPurchase = createPurchase;
// Get all purchases
const getAllPurchases = () => __awaiter(void 0, void 0, void 0, function* () {
    const purchasesRef = (0, firestore_1.collection)(firebase_1.db, "purchases");
    const purchasesSnapshot = yield (0, firestore_1.getDocs)(purchasesRef);
    return purchasesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllPurchases = getAllPurchases;
// Get purchases by user ID
const getPurchasesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const purchasesRef = (0, firestore_1.collection)(firebase_1.db, "purchases");
    const q = (0, firestore_1.query)(purchasesRef, (0, firestore_1.where)("userId", "==", userId));
    const purchasesSnapshot = yield (0, firestore_1.getDocs)(q);
    return purchasesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getPurchasesByUserId = getPurchasesByUserId;
// Get purchase by ID
const getPurchaseById = (purchaseId) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "purchases", purchaseId));
    return purchaseDoc.exists() ? purchaseDoc.data() : null;
});
exports.getPurchaseById = getPurchaseById;
