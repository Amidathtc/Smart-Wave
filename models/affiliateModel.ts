import {
  query,
  collection,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Get affiliate earnings
export const getAffiliateEarnings = async (affiliateId: string) => {
  const earningsRef = collection(db, "earnings"); // Assuming you have an earnings collection
  const q = query(earningsRef, where("affiliateId", "==", affiliateId));
  const earningsSnapshot = await getDocs(q);

  let totalEarnings = 0;
  let unpaidEarnings = 0;
  let referralEarnings = 0;
  let bonusEarnings = 0;

  earningsSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    totalEarnings += data.amount; // Assuming `amount` is a field in your earnings document
    if (!data.paid) {
      // Assuming `paid` is a boolean field indicating if the earnings have been paid
      unpaidEarnings += data.amount;
    }
    referralEarnings += data.referralEarnings || 0; // Adjust based on your earnings structure
    bonusEarnings += data.bonusEarnings || 0; // Adjust based on your earnings structure
  });

  return {
    totalEarnings,
    unpaidEarnings,
    referralEarnings,
    bonusEarnings,
  };
};

// Get affiliate referrals
export const getAffiliateReferrals = async (affiliateId: string) => {
  const referralsRef = collection(db, "referrals"); // Assuming you have a referrals collection
  const q = query(referralsRef, where("referrerId", "==", affiliateId)); // Assuming `referrerId` is the field that links to the affiliate
  const referralsSnapshot = await getDocs(q);
  return referralsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get affiliate transaction history
export const getAffiliateTransactionHistory = async (affiliateId: string) => {
  const transactionsRef = collection(db, "transactions"); // Assuming you have a transactions collection
  const q = query(transactionsRef, where("affiliateId", "==", affiliateId)); // Assuming `affiliateId` is the field that links to the affiliate
  const transactionsSnapshot = await getDocs(q);
  return transactionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get all affiliates
export const getAllAffiliates = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", "affiliate"));
  const affiliatesSnapshot = await getDocs(q);
  return affiliatesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get an affiliate by ID
export const getAffiliateById = async (affiliateId: string) => {
  const affiliateDoc = await getDoc(doc(db, "users", affiliateId));
  return affiliateDoc.exists() ? affiliateDoc.data() : null;
};
