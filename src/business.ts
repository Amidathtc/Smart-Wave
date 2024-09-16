// src/business.ts
import { db } from "./admin";
import { collection, addDoc } from "firebase/firestore";

export const registerBusiness = async (data: {
  type: string;
  name: string;
  userId: string;
}) => {
  const businessesRef = collection(db, "businesses");
  const docRef = await addDoc(businessesRef, data);
  return docRef.id;
};
