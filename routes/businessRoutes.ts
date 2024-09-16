import express, { Router } from "express";
import { registerBusinessController } from "../controllers/businessController";

const router:Router = Router();

router.post("/register-business", registerBusinessController);

export default router;
