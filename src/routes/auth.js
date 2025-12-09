import express from "express";
import { login, getProfile, register, getInfomationAccount } from "../controllers/auth.js";
import { verifyToken } from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/login", login);
router.get("/profile", getProfile);
router.post("/register", register);
router.get("/information", verifyToken, getInfomationAccount);

export default router;






