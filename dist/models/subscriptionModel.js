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
exports.getSubscriptionByUserId = exports.createSubscription = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
const createSubscription = (userId, plan) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionDocRef = (0, firestore_1.doc)(firebase_1.db, "subscriptions", userId);
    const subscriptionData = {
        userId,
        plan,
        status: "active",
        createdAt: new Date().getTime(),
    };
    yield (0, firestore_1.setDoc)(subscriptionDocRef, subscriptionData);
    return subscriptionData;
});
exports.createSubscription = createSubscription;
const getSubscriptionByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionDocRef = (0, firestore_1.doc)(firebase_1.db, "subscriptions", userId);
    const subscriptionDoc = yield (0, firestore_1.getDoc)(subscriptionDocRef);
    if (subscriptionDoc.exists()) {
        return subscriptionDoc.data();
    }
    else {
        return null;
    }
});
exports.getSubscriptionByUserId = getSubscriptionByUserId;
