"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.addProduct = void 0;
// src/products.ts
const admin_1 = require("./admin");
const firestore_1 = require("firebase/firestore");
const addProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const productsRef = (0, firestore_1.collection)(admin_1.db, "products");
    const docRef = yield (0, firestore_1.addDoc)(productsRef, data);
    return docRef.id;
});
exports.addProduct = addProduct;
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const productsRef = (0, firestore_1.collection)(admin_1.db, "products");
    const snapshot = yield (0, firestore_1.getDocs)(productsRef);
    const products = snapshot.docs.map((doc) => doc.data());
    return products;
});
exports.getAllProducts = getAllProducts;
