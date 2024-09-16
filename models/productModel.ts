import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const getAllProducts = async () => {
  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(productsRef);
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return products;
};

// Add a product
export const addProduct = async (product: any) => {
  const productDocRef = doc(collection(db, "products"));
  await setDoc(productDocRef, product);
  return productDocRef.id;
};

// Get product by ID
export const getProductById = async (productId: string) => {
  const productDoc = await getDoc(doc(db, "products", productId));
  return productDoc.exists() ? productDoc.data() : null;
};

// Update product quantity after purchase
export const updateProductQuantity = async (
  productId: string,
  newQuantity: number
) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { quantity: newQuantity });
};

// Get products by category
export const getProductsByCategory = async (category: string) => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("category", "==", category));
  const productsSnapshot = await getDocs(q);
  return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update product approval status
export const updateProductApproval = async (
  productId: string,
  status: string
) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { approvalStatus: status });
};
