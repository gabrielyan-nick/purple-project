import express from "express";
import multer from "multer";
import { login, register } from "../controllers/auth.js";

const router = express.Router();
const upload = multer();

router.post("/login", login);
router.post("/register", upload.none(), register);

export default router;
