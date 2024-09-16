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
exports.getUserTransactions = exports.getTransactionDetailsById = exports.getTransactionById = exports.getTransactionByCategory = exports.getAllTransactions = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
// Get all transactions
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsRef = (0, firestore_1.collection)(firebase_1.db, "transactions");
    const transactionsSnapshot = yield (0, firestore_1.getDocs)(transactionsRef);
    return transactionsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllTransactions = getAllTransactions;
// Get transactions by category
const getTransactionByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsRef = (0, firestore_1.collection)(firebase_1.db, "transactions");
    const q = (0, firestore_1.query)(transactionsRef, (0, firestore_1.where)("category", "==", category));
    const transactionsSnapshot = yield (0, firestore_1.getDocs)(q);
    return transactionsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getTransactionByCategory = getTransactionByCategory;
// Get a transaction by ID
const getTransactionById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "transactions", transactionId));
    return transactionDoc.exists() ? transactionDoc.data() : null;
});
exports.getTransactionById = getTransactionById;
// Get transaction details by ID
const getTransactionDetailsById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "transactions", transactionId));
    return transactionDoc.exists() ? transactionDoc.data() : null;
});
exports.getTransactionDetailsById = getTransactionDetailsById;
// Get transactions for a user
const getUserTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsRef = (0, firestore_1.collection)(firebase_1.db, "transactions");
    const q = (0, firestore_1.query)(transactionsRef, (0, firestore_1.where)("userId", "==", userId));
    const transactionsSnapshot = yield (0, firestore_1.getDocs)(q);
    return transactionsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getUserTransactions = getUserTransactions;
