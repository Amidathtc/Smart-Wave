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
exports.updateReferralEarnings = exports.getReferralData = exports.getReferralsByUserId = exports.addReferral = exports.storeReferralData = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Store referral data for a user
const storeReferralData = (userId, referralData) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "referrals", userId), referralData, { merge: true });
});
exports.storeReferralData = storeReferralData;
// Add a referral
const addReferral = (referral) => __awaiter(void 0, void 0, void 0, function* () {
    const referralDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, "referrals"));
    yield (0, firestore_1.setDoc)(referralDocRef, referral);
    return referralDocRef.id;
});
exports.addReferral = addReferral;
// Get referrals by user ID
const getReferralsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const referralsRef = (0, firestore_1.collection)(firebase_1.db, "referrals");
    const q = (0, firestore_1.query)(referralsRef, (0, firestore_1.where)("userId", "==", userId));
    const referralsSnapshot = yield (0, firestore_1.getDocs)(q);
    const referrals = referralsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
    return referrals;
});
exports.getReferralsByUserId = getReferralsByUserId;
// Get referral data for a user
const getReferralData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const referralDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "referrals", userId));
    return referralDoc.exists() ? referralDoc.data() : null;
});
exports.getReferralData = getReferralData;
// Update referral earnings
const updateReferralEarnings = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const referralRef = (0, firestore_1.doc)(firebase_1.db, "referrals", userId);
    yield (0, firestore_1.updateDoc)(referralRef, {
        totalEarnings: amount,
        totalInvites: amount > 0 ? 1 : 0, // Increment invite count based on earnings
    });
});
exports.updateReferralEarnings = updateReferralEarnings;
