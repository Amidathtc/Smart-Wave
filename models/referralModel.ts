import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Store referral data for a user
export const storeReferralData = async (userId: string, referralData: any) => {
  await setDoc(doc(db, "referrals", userId), referralData, { merge: true });
};

// Add a referral
export const addReferral = async (referral: any) => {
  const referralDocRef = doc(collection(db, "referrals"));
  await setDoc(referralDocRef, referral);
  return referralDocRef.id;
};

// Get referrals by user ID
export const getReferralsByUserId = async (userId: string) => {
  const referralsRef = collection(db, "referrals");
  const q = query(referralsRef, where("userId", "==", userId));
  const referralsSnapshot = await getDocs(q);
  const referrals = referralsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return referrals;
};

// Get referral data for a user
export const getReferralData = async (userId: string) => {
  const referralDoc = await getDoc(doc(db, "referrals", userId));
  return referralDoc.exists() ? referralDoc.data() : null;
};

// Update referral earnings
export const updateReferralEarnings = async (
  userId: string,
  amount: number
) => {
  const referralRef = doc(db, "referrals", userId);
  await updateDoc(referralRef, {
    totalEarnings: amount,
    totalInvites: amount > 0 ? 1 : 0, // Increment invite count based on earnings
  });
};
