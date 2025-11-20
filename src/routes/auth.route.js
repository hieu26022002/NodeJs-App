const express = require("express");
const { login, getProfile, register } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.get("/profile", getProfile);
router.post("/register", register);

module.exports = router;


