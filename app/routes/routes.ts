// Route composition layer. Add feature routers here when scaling.
import { Router, Request, Response } from "express";
const router = Router();

// list of routers
import { login } from "../controllers/auth/auth";


// auth
router.post("/login", login);

export default router;
