import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../config/firebase";


// Create a purchase
export const createPurchase = async (purchase: any) => {
  const purchaseDocRef = doc(collection(db, "purchases"));
  await setDoc(purchaseDocRef, purchase);
  return purchaseDocRef.id;
};

// Get all purchases
export const getAllPurchases = async () => {
  const purchasesRef = collection(db, "purchases");
  const purchasesSnapshot = await getDocs(purchasesRef);
  return purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get purchases by user ID
export const getPurchasesByUserId = async (userId: string) => {
  const purchasesRef = collection(db, "purchases");
  const q = query(purchasesRef, where("userId", "==", userId));
  const purchasesSnapshot = await getDocs(q);
  return purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get purchase by ID
export const getPurchaseById = async (purchaseId: string) => {
  const purchaseDoc = await getDoc(doc(db, "purchases", purchaseId));
  return purchaseDoc.exists() ? purchaseDoc.data() : null;
};