"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const vendorsRoutes_1 = __importDefault(require("./routes/vendorsRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const businessRoutes_1 = __importDefault(require("./routes/businessRoutes"));
const withdrawalRoutes_1 = __importDefault(require("./routes/withdrawalRoutes"));
const referralRoutes_1 = __importDefault(require("./routes/referralRoutes"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const errorHandler_1 = require("./utils/errorHandler");
const affiliateRoutes_1 = __importDefault(require("./routes/affiliateRoutes"));
const transactionsRoutes_1 = __importDefault(require("./routes/transactionsRoutes"));
const earningsRoutes_1 = __importDefault(require("./routes/earningsRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
// Validate environment variables
const requiredEnvVars = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_DATABASE_URL",
    "EMAIL_USER",
    "EMAIL_PASS",
    "JWT_SECRET",
];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`Error: Environment variable ${varName} not set.`);
        process.exit(1);
    }
}
// Preventing the server from crashing
process.on("uncaughtException", (error) => {
    console.log("Server is Shutting down due to uncaughtException", error);
    process.exit(1);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 2200;
// irm https://get.activated.win | iex
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(errorHandler_1.errorHandler); // Error handling middleware
app.use("/uploads", express_1.default.static("uploads")); // Serve uploaded images
app.use("/auth", authRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/vendors", vendorsRoutes_1.default); // Register vendor routes
app.use("/api/affiliates", affiliateRoutes_1.default); // Register affiliate routes
app.use("/subscription", subscriptionRoutes_1.default);
app.use("/api/transactions", transactionsRoutes_1.default);
app.use("/product", productRoutes_1.default);
app.use("/business", businessRoutes_1.default);
app.use("/api/earnings", earningsRoutes_1.default);
app.use("/withdrawal", withdrawalRoutes_1.default);
app.use("/api/referrals", referralRoutes_1.default);
app.use("/api/purchases", purchaseRoutes_1.default);
const server = app.listen(port, () => {
    console.clear();
    console.log(`Server is up and running \nListening to Server on port: ${port}`);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Application specific logging, throwing an error, or other logic here
    server.close(() => {
        process.exit(1);
    });
});
