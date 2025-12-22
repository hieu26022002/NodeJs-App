import express from "express";
import { getInfomationAccount, getProfile, login, register, updateInformationAccount } from "../controllers/auth.js";
import { verifyToken } from "../middleware/checkAuth.js";

const router = express.Router();

// Route /api/auth (POST) - hỗ trợ cả /api/auth và /api/auth/login
router.post("/", login);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/register", register);
router.get("/information", verifyToken, getInfomationAccount);
router.put("/information", verifyToken, updateInformationAccount);

export default router;






