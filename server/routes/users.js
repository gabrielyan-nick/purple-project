import express from "express";
import multer from "multer";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserInfo
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer()

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE FRIENDS
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// UPDATE USER INFO
router.patch("/:id", verifyToken, upload.none(), updateUserInfo) 

export default router;
