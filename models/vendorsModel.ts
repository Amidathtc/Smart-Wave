import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Get total earnings and other metrics for a vendor
export const getVendorEarnings = async (vendorId: string) => {
  const vendorDoc = await getDoc(doc(db, "vendors", vendorId));
  return vendorDoc.exists() ? vendorDoc.data() : null;
};

// Get products for a vendor
export const getVendorProducts = async (vendorId: string) => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("vendorId", "==", vendorId));
  const productsSnapshot = await getDocs(q);
  return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get sales history for a vendor
export const getVendorSalesHistory = async (vendorId: string) => {
  const salesRef = collection(db, "sales");
  const q = query(salesRef, where("vendorId", "==", vendorId));
  const salesSnapshot = await getDocs(q);
  return salesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get transaction history for a vendor
export const getVendorTransactionHistory = async (vendorId: string) => {
  const transactionsRef = collection(db, "transactions");
  const q = query(transactionsRef, where("vendorId", "==", vendorId));
  const transactionsSnapshot = await getDocs(q);
  return transactionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get all vendors
export const getAllVendors = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", "vendor"));
  const vendorsSnapshot = await getDocs(q);
  return vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a vendor by ID
export const getVendorById = async (vendorId: string) => {
  const vendorDoc = await getDoc(doc(db, "users", vendorId));
  return vendorDoc.exists() ? vendorDoc.data() : null;
};
