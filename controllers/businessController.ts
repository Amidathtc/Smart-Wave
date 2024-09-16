import { Request, Response } from "express";
import { registerBusiness } from "../models/businessModel";

export const registerBusinessController = async (req: Request, res: Response) => {
  const { type, name, userId } = req.body;
  try {
    const businessId = await registerBusiness({ type, name, userId });
    res.json({ businessId });
  } catch (error) {
    console.error("Register business error:", error);
    res.status(500).json({ error: "An error occurred while registering the business" });
  }
};
