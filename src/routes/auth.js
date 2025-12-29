import express from "express";
import { getInfomationAccount, getProfile, login, register, updateInformationAccount, uploadAvatar } from "../controllers/auth.js";
import { verifyToken } from "../middleware/checkAuth.js";
import upload from "../middleware/uploadFile.js";

const router = express.Router();

// Route /api/auth (POST) - hỗ trợ cả /api/auth và /api/auth/login
router.post("/", login);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/register", register);
router.get("/information", verifyToken, getInfomationAccount);
router.put("/information", verifyToken, updateInformationAccount);

router.post(
    "/information/avatar",
    verifyToken,
    upload.single("avatar"),  // field name trên form là "avatar"
    uploadAvatar
);


export default router;






