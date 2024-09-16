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
exports.getAffiliateById = exports.getAllAffiliates = exports.getAffiliateTransactionHistory = exports.getAffiliateReferrals = exports.getAffiliateEarnings = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Get affiliate earnings
const getAffiliateEarnings = (affiliateId) => __awaiter(void 0, void 0, void 0, function* () {
    const earningsRef = (0, firestore_1.collection)(firebase_1.db, "earnings"); // Assuming you have an earnings collection
    const q = (0, firestore_1.query)(earningsRef, (0, firestore_1.where)("affiliateId", "==", affiliateId));
    const earningsSnapshot = yield (0, firestore_1.getDocs)(q);
    let totalEarnings = 0;
    let unpaidEarnings = 0;
    let referralEarnings = 0;
    let bonusEarnings = 0;
    earningsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalEarnings += data.amount; // Assuming `amount` is a field in your earnings document
        if (!data.paid) {
            // Assuming `paid` is a boolean field indicating if the earnings have been paid
            unpaidEarnings += data.amount;
        }
        referralEarnings += data.referralEarnings || 0; // Adjust based on your earnings structure
        bonusEarnings += data.bonusEarnings || 0; // Adjust based on your earnings structure
    });
    return {
        totalEarnings,
        unpaidEarnings,
        referralEarnings,
        bonusEarnings,
    };
});
exports.getAffiliateEarnings = getAffiliateEarnings;
// Get affiliate referrals
const getAffiliateReferrals = (affiliateId) => __awaiter(void 0, void 0, void 0, function* () {
    const referralsRef = (0, firestore_1.collection)(firebase_1.db, "referrals"); // Assuming you have a referrals collection
    const q = (0, firestore_1.query)(referralsRef, (0, firestore_1.where)("referrerId", "==", affiliateId)); // Assuming `referrerId` is the field that links to the affiliate
    const referralsSnapshot = yield (0, firestore_1.getDocs)(q);
    return referralsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAffiliateReferrals = getAffiliateReferrals;
// Get affiliate transaction history
const getAffiliateTransactionHistory = (affiliateId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsRef = (0, firestore_1.collection)(firebase_1.db, "transactions"); // Assuming you have a transactions collection
    const q = (0, firestore_1.query)(transactionsRef, (0, firestore_1.where)("affiliateId", "==", affiliateId)); // Assuming `affiliateId` is the field that links to the affiliate
    const transactionsSnapshot = yield (0, firestore_1.getDocs)(q);
    return transactionsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAffiliateTransactionHistory = getAffiliateTransactionHistory;
// Get all affiliates
const getAllAffiliates = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersRef = (0, firestore_1.collection)(firebase_1.db, "users");
    const q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("role", "==", "affiliate"));
    const affiliatesSnapshot = yield (0, firestore_1.getDocs)(q);
    return affiliatesSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllAffiliates = getAllAffiliates;
// Get an affiliate by ID
const getAffiliateById = (affiliateId) => __awaiter(void 0, void 0, void 0, function* () {
    const affiliateDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", affiliateId));
    return affiliateDoc.exists() ? affiliateDoc.data() : null;
});
exports.getAffiliateById = getAffiliateById;
