// Route composition layer. Add feature routers here when scaling.
import { Router, Request, Response } from "express";
const router = Router();

// list of routers
import { UserSessionGenerate } from "../controllers/auth/auth";

// auth
router.post("/auth/sync", UserSessionGenerate);

export default router;
