import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Create a withdrawal request
export const createWithdrawalRequest = async (withdrawalRequest: any) => {
  const withdrawalDocRef = doc(collection(db, "withdrawals"));
  await setDoc(withdrawalDocRef, withdrawalRequest);
  return withdrawalDocRef.id;
};

// Get all withdrawals
export const getAllWithdrawals = async () => {
  const withdrawalsRef = collection(db, "withdrawals");
  const withdrawalsSnapshot = await getDocs(withdrawalsRef);
  return withdrawalsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get withdrawals for a specific user
export const getAUserWithdrawals = async (userId: string) => {
  const withdrawalsRef = collection(db, "withdrawals");
  const q = query(withdrawalsRef, where("userId", "==", userId));
  const withdrawalsSnapshot = await getDocs(q);
  return withdrawalsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a withdrawal by ID
export const getAWithdrawalById = async (withdrawalId: string) => {
  const withdrawalDoc = await getDoc(doc(db, "withdrawals", withdrawalId));
  return withdrawalDoc.exists() ? withdrawalDoc.data() : null;
};

// Update withdrawal approval status
export const updateWithdrawalApproval = async (
  requestId: string,
  status: string
) => {
  const withdrawalRef = doc(db, "withdrawals", requestId);
  await updateDoc(withdrawalRef, { status });
};

// Get pending withdrawals
export const getPendingWithdrawals = async () => {
  const withdrawalsRef = collection(db, "withdrawals");
  const q = query(withdrawalsRef, where("status", "==", "pending")); // Filter for pending withdrawals
  const withdrawalsSnapshot = await getDocs(q);
  return withdrawalsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
