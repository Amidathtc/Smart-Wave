import { Request, Response } from "express";
import { createSubscription, getSubscriptionByUserId } from "../models/subscriptionModel";

export const subscribe = async (req: Request, res: Response) => {
  const { userId, plan } = req.body;
  try {
    const subscription = await createSubscription(userId, plan);
    res.json({ message: "Subscription created", subscription });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ error: "An error occurred while creating the subscription" });
  }
};

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
