import express from "express";
import { presignGet } from "../storage/s3.js";

const router = express.Router();

router.get("/pre-sign", presignGet);

export default router;