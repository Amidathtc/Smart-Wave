import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Get all transactions
export const getAllTransactions = async () => {
  const transactionsRef = collection(db, "transactions");
  const transactionsSnapshot = await getDocs(transactionsRef);
  return transactionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get transactions by category
export const getTransactionByCategory = async (category: string) => {
  const transactionsRef = collection(db, "transactions");
  const q = query(transactionsRef, where("category", "==", category));
  const transactionsSnapshot = await getDocs(q);
  return transactionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get a transaction by ID
export const getTransactionById = async (transactionId: string) => {
  const transactionDoc = await getDoc(doc(db, "transactions", transactionId));
  return transactionDoc.exists() ? transactionDoc.data() : null;
};

// Get transaction details by ID
export const getTransactionDetailsById = async (transactionId: string) => {
  const transactionDoc = await getDoc(doc(db, "transactions", transactionId));
  return transactionDoc.exists() ? transactionDoc.data() : null;
};

// Get transactions for a user
export const getUserTransactions = async (userId: string) => {
  const transactionsRef = collection(db, "transactions");
  const q = query(transactionsRef, where("userId", "==", userId));
  const transactionsSnapshot = await getDocs(q);
  return transactionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
