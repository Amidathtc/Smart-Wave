// src/products.ts
import { db } from "./admin";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addProduct = async (data: {
  name: string;
  price: number;
  commission: number;
}) => {
  const productsRef = collection(db, "products");
  const docRef = await addDoc(productsRef, data);
  return docRef.id;
};

export const getAllProducts = async () => {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);
  const products = snapshot.docs.map((doc) => doc.data());
  return products;
};
