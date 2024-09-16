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
exports.getPendingWithdrawals = exports.updateWithdrawalApproval = exports.getAWithdrawalById = exports.getAUserWithdrawals = exports.getAllWithdrawals = exports.createWithdrawalRequest = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Create a withdrawal request
const createWithdrawalRequest = (withdrawalRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, "withdrawals"));
    yield (0, firestore_1.setDoc)(withdrawalDocRef, withdrawalRequest);
    return withdrawalDocRef.id;
});
exports.createWithdrawalRequest = createWithdrawalRequest;
// Get all withdrawals
const getAllWithdrawals = () => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalsRef = (0, firestore_1.collection)(firebase_1.db, "withdrawals");
    const withdrawalsSnapshot = yield (0, firestore_1.getDocs)(withdrawalsRef);
    return withdrawalsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllWithdrawals = getAllWithdrawals;
// Get withdrawals for a specific user
const getAUserWithdrawals = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalsRef = (0, firestore_1.collection)(firebase_1.db, "withdrawals");
    const q = (0, firestore_1.query)(withdrawalsRef, (0, firestore_1.where)("userId", "==", userId));
    const withdrawalsSnapshot = yield (0, firestore_1.getDocs)(q);
    return withdrawalsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAUserWithdrawals = getAUserWithdrawals;
// Get a withdrawal by ID
const getAWithdrawalById = (withdrawalId) => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "withdrawals", withdrawalId));
    return withdrawalDoc.exists() ? withdrawalDoc.data() : null;
});
exports.getAWithdrawalById = getAWithdrawalById;
// Update withdrawal approval status
const updateWithdrawalApproval = (requestId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalRef = (0, firestore_1.doc)(firebase_1.db, "withdrawals", requestId);
    yield (0, firestore_1.updateDoc)(withdrawalRef, { status });
});
exports.updateWithdrawalApproval = updateWithdrawalApproval;
// Get pending withdrawals
const getPendingWithdrawals = () => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalsRef = (0, firestore_1.collection)(firebase_1.db, "withdrawals");
    const q = (0, firestore_1.query)(withdrawalsRef, (0, firestore_1.where)("status", "==", "pending")); // Filter for pending withdrawals
    const withdrawalsSnapshot = yield (0, firestore_1.getDocs)(q);
    return withdrawalsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getPendingWithdrawals = getPendingWithdrawals;
