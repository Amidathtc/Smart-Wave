// src/subscriptions.ts
import { flw } from "../config/flutterwave";
import { db } from "./admin";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const createSubscription = async (userId: string, plan: string) => {
  const subscriptionRef = doc(db, "subscriptions", userId);
  await setDoc(subscriptionRef, { userId, plan, status: "pending" });
  return subscriptionRef.id;
};

export const getSubscriptionByUserId = async (userId: string) => {
  const subscriptionRef = doc(db, "subscriptions", userId);
  const snapshot = await getDoc(subscriptionRef);
  return snapshot.exists() ? snapshot.data() : null;
};

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

const updateSubscriptionStatus = async (userId: string, status: string) => {
  const subscriptionRef = doc(db, "subscriptions", userId);
  await setDoc(subscriptionRef, { status }, { merge: true });
};
