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
const admin_1 = require("./admin");
const firestore_1 = require("firebase/firestore");
const createSubscription = (userId, plan) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionRef = (0, firestore_1.doc)(admin_1.db, "subscriptions", userId);
    yield (0, firestore_1.setDoc)(subscriptionRef, { userId, plan, status: "pending" });
    return subscriptionRef.id;
});
exports.createSubscription = createSubscription;
const getSubscriptionByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionRef = (0, firestore_1.doc)(admin_1.db, "subscriptions", userId);
    const snapshot = yield (0, firestore_1.getDoc)(subscriptionRef);
    return snapshot.exists() ? snapshot.data() : null;
});
exports.getSubscriptionByUserId = getSubscriptionByUserId;
// export const initiatePayment = async (userId: string, plan: string, amount: number, email: string) => {
//   const paymentData = {
//     tx_ref: `TX-${userId}-${Date.now()}`,
//     amount: amount,
//     currency: 'NGN',
//     payment_options: 'card',
//     redirect_url: 'https://your-redirect-url.com',
//     customer: {
//       email: email,
//     },
//     customizations: {
//       title: 'Subscription Payment',
//       description: `Payment for ${plan} plan`,
//     },
//   };
//   try {
//     const response = await flw.Payment.card(paymentData);
//     if (response.status === 'success') {
//       await updateSubscriptionStatus(userId, 'active');
//       return response.data;
//     } else {
//       throw new Error('Payment failed');
//     }
//   } catch (error) {
//     throw new Error('Payment initiation failed');
//   }
// };
const updateSubscriptionStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionRef = (0, firestore_1.doc)(admin_1.db, "subscriptions", userId);
    yield (0, firestore_1.setDoc)(subscriptionRef, { status }, { merge: true });
});
