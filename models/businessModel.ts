import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const registerBusiness = async (business: any) => {
  const businessDocRef = doc(collection(db, "businesses"));
  await setDoc(businessDocRef, business);
  return businessDocRef.id;
};
