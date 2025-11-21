import express from "express";
import { login, getProfile, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/profile", getProfile);
router.post("/register", register);

export default router;

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const users = require("./users");

// const app = express();
// app.use(express.json());

// const JWT_SECRET = "my-secret-key"; // bình thường phải dùng biến môi trường .env






