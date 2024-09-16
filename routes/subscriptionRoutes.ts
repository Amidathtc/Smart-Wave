import { Router } from "express";
import { subscribe } from "../controllers/subscriptionController";

const router:Router = Router();

router.post("/subscribe", subscribe);
// , dashboard
// router.get("/dashboard", dashboard);

export default router;
