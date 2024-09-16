// src/withdrawals.ts
import { db } from "./admin";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const requestWithdrawal = async (data: {
  userId: string;
  amount: number;
  accountDetails: string;
}) => {
  const withdrawalsRef = collection(db, "withdrawals");
  const docRef = await addDoc(withdrawalsRef, data);
  return docRef.id;
};

export const getPendingWithdrawals = async () => {
  const withdrawalsRef = collection(db, "withdrawals");
  const snapshot = await getDocs(withdrawalsRef);
  const withdrawals = snapshot.docs.map((doc) => doc.data());
  return withdrawals;
};
