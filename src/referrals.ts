// src/referrals.ts
import { db } from "./admin";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addReferral = async (data: {
  userId: string;
  referralCode: string;
}) => {
  const referralsRef = collection(db, "referrals");
  const docRef = await addDoc(referralsRef, data);
  return docRef.id;
};

export const getReferralsByUserId = async (userId: string) => {
  const referralsRef = collection(db, "referrals");
  const snapshot = await getDocs(referralsRef);
  const referrals = snapshot.docs
    .filter((doc) => doc.data().userId === userId)
    .map((doc) => doc.data());
  return referrals;
};
