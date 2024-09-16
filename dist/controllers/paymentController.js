"use strict";
// import { Request, Response } from "express";
// import axios from "axios";
// import { db } from "../config/firebase"; // Adjust the import path as necessary
// import { doc, updateDoc } from "firebase/firestore";
// import dotenv from "dotenv";
// import { getUserById } from "../models/userModel";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaymentCallback = exports.initiateRegistrationPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = require("../models/userModel");
dotenv_1.default.config();
const initiateRegistrationPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId } = req.params;
    const registrationFee = 25000; // Fixed registration fee amount in Naira
    // Validate input
    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }
    // Fetch user details
    const user = yield (0, userModel_1.getUserById)(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    // Create a payment request to Flutterwave
    const paymentData = {
        tx_ref: `reg_${userId}_${Date.now()}`, // Unique transaction reference
        amount: registrationFee,
        currency: "NGN",
        payment_options: "card,banktransfer",
        customer: {
            email: user.email,
            phonenumber: user.phoneNumber,
            name: user.name,
        },
        customizations: {
            title: "Registration Fee Payment",
            description: "Payment for user registration",
            logo: "https://yourwebsite.com/logo.png",
        },
        redirect_url: `${process.env.FRONTEND_URL}/payment-callback`,
    };
    try {
        const response = yield axios_1.default.post("https://api.flutterwave.com/v3/payments", paymentData, {
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const { data } = response.data;
        res.status(200).json({ paymentLink: data.link });
    }
    catch (error) {
        console.error("Error initiating payment:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({
            error: "Failed to initiate payment. Please try again later.",
            details: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
        });
    }
});
exports.initiateRegistrationPayment = initiateRegistrationPayment;
const handlePaymentCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, tx_ref, transaction_id } = req.query;
    if (typeof status !== 'string' || typeof tx_ref !== 'string' || typeof transaction_id !== 'string') {
        console.error("Invalid query parameters");
        return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }
    if (status === "successful") {
        try {
            // Verify the transaction
            const verificationResponse = yield axios_1.default.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
                headers: {
                    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                },
            });
            const { data } = verificationResponse.data;
            if (data.status === "successful" && data.amount >= 25000 && data.currency === "NGN") {
                // Extract userId from tx_ref
                const parts = tx_ref.split('_');
                if (parts.length < 2) {
                    console.error("Invalid tx_ref format");
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
                }
                const userId = parts[1];
                // Update user's registration status in Firestore
                const userRef = (0, firestore_1.doc)(firebase_1.db, "users", userId);
                yield (0, firestore_1.updateDoc)(userRef, { registrationStatus: "paid" });
                return res.redirect(`${process.env.FRONTEND_URL}/registration-success`);
            }
            else {
                return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
            }
        }
        catch (error) {
            console.error("Error verifying payment:", error);
            return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
        }
    }
    else {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
});
exports.handlePaymentCallback = handlePaymentCallback;
