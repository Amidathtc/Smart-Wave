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

// Get all earnings
export const getAllEarnings = async () => {
  const earningsRef = collection(db, "earnings");
  const earningsSnapshot = await getDocs(earningsRef);
  return earningsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get earnings for a specific user
export const getUserEarnings = async (userId: string) => {
  const earningsRef = collection(db, "earnings");
  const q = query(earningsRef, where("userId", "==", userId)); // Assuming userId is a field in earnings
  const earningsSnapshot = await getDocs(q);
  return earningsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get earnings by category
export const getEarningsByCategory = async (category: string) => {
  const earningsRef = collection(db, "earnings");
  const q = query(earningsRef, where("category", "==", category)); // Assuming category is a field in earnings
  const earningsSnapshot = await getDocs(q);
  return earningsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get earnings by ID
export const getEarningById = async (earningId: string) => {
  const earningDoc = await getDoc(doc(db, "earnings", earningId));
  return earningDoc.exists() ? earningDoc.data() : null;
};
