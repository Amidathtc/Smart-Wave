import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const createSubscription = async (userId: string, plan: string) => {
  const subscriptionDocRef = doc(db, "subscriptions", userId);
  const subscriptionData = {
    userId,
    plan,
    status: "active",
    createdAt: new Date().getTime(),
  };

  await setDoc(subscriptionDocRef, subscriptionData);
  return subscriptionData;
};

export const getSubscriptionByUserId = async (userId: string) => {
  const subscriptionDocRef = doc(db, "subscriptions", userId);
  const subscriptionDoc = await getDoc(subscriptionDocRef);

  if (subscriptionDoc.exists()) {
    return subscriptionDoc.data();
  } else {
    return null;
  }
};
