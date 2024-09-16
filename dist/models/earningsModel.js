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
exports.getEarningById = exports.getEarningsByCategory = exports.getUserEarnings = exports.getAllEarnings = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Get all earnings
const getAllEarnings = () => __awaiter(void 0, void 0, void 0, function* () {
    const earningsRef = (0, firestore_1.collection)(firebase_1.db, "earnings");
    const earningsSnapshot = yield (0, firestore_1.getDocs)(earningsRef);
    return earningsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllEarnings = getAllEarnings;
// Get earnings for a specific user
const getUserEarnings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const earningsRef = (0, firestore_1.collection)(firebase_1.db, "earnings");
    const q = (0, firestore_1.query)(earningsRef, (0, firestore_1.where)("userId", "==", userId)); // Assuming userId is a field in earnings
    const earningsSnapshot = yield (0, firestore_1.getDocs)(q);
    return earningsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getUserEarnings = getUserEarnings;
// Get earnings by category
const getEarningsByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const earningsRef = (0, firestore_1.collection)(firebase_1.db, "earnings");
    const q = (0, firestore_1.query)(earningsRef, (0, firestore_1.where)("category", "==", category)); // Assuming category is a field in earnings
    const earningsSnapshot = yield (0, firestore_1.getDocs)(q);
    return earningsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getEarningsByCategory = getEarningsByCategory;
// Get earnings by ID
const getEarningById = (earningId) => __awaiter(void 0, void 0, void 0, function* () {
    const earningDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "earnings", earningId));
    return earningDoc.exists() ? earningDoc.data() : null;
});
exports.getEarningById = getEarningById;
