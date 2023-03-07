import express from "express";
import multer from "multer";
import { login, register, forgotPass, resetPass } from "../controllers/auth.js";

const router = express.Router();
const upload = multer();

router.post("/login", login);
router.post("/register", upload.none(), register);
router.post("/forgot-password", upload.none(), forgotPass);
router.post("/reset-password", upload.none(), resetPass);

export default router;
