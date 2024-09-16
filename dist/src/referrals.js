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
exports.getReferralsByUserId = exports.addReferral = void 0;
// src/referrals.ts
const admin_1 = require("./admin");
const firestore_1 = require("firebase/firestore");
const addReferral = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const referralsRef = (0, firestore_1.collection)(admin_1.db, "referrals");
    const docRef = yield (0, firestore_1.addDoc)(referralsRef, data);
    return docRef.id;
});
exports.addReferral = addReferral;
const getReferralsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const referralsRef = (0, firestore_1.collection)(admin_1.db, "referrals");
    const snapshot = yield (0, firestore_1.getDocs)(referralsRef);
    const referrals = snapshot.docs
        .filter((doc) => doc.data().userId === userId)
        .map((doc) => doc.data());
    return referrals;
});
exports.getReferralsByUserId = getReferralsByUserId;
