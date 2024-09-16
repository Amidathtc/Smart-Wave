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
exports.subscribe = void 0;
const subscriptionModel_1 = require("../models/subscriptionModel");
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, plan } = req.body;
    try {
        const subscription = yield (0, subscriptionModel_1.createSubscription)(userId, plan);
        res.json({ message: "Subscription created", subscription });
    }
    catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ error: "An error occurred while creating the subscription" });
    }
});
exports.subscribe = subscribe;
// export const dashboard = async (req: any, res: Response) => {
//   const userId = req.headers.authorization;
//   try {
//     const subscription = await getSubscriptionByUserId(userId);
//     if (subscription && subscription.status === "active") {
//       res.render("dashboard");
//     } else {
//       res.redirect("/subscribe");
//     }
//   } catch (error) {
//     console.error("Dashboard error:", error);
//     res.status(500).json({ error: "An error occurred while fetching the dashboard" });
//   }
// };
