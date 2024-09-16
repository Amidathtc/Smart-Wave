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
exports.getPendingWithdrawals = exports.requestWithdrawal = void 0;
// src/withdrawals.ts
const admin_1 = require("./admin");
const firestore_1 = require("firebase/firestore");
const requestWithdrawal = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalsRef = (0, firestore_1.collection)(admin_1.db, "withdrawals");
    const docRef = yield (0, firestore_1.addDoc)(withdrawalsRef, data);
    return docRef.id;
});
exports.requestWithdrawal = requestWithdrawal;
const getPendingWithdrawals = () => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawalsRef = (0, firestore_1.collection)(admin_1.db, "withdrawals");
    const snapshot = yield (0, firestore_1.getDocs)(withdrawalsRef);
    const withdrawals = snapshot.docs.map((doc) => doc.data());
    return withdrawals;
});
exports.getPendingWithdrawals = getPendingWithdrawals;
