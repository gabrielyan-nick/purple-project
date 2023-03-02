import express from "express";
import multer from "multer";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserInfo,
  changeAvatar,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer();

// UPDATE USER INFO
router.patch("/:id/avatar", verifyToken, upload.none(), changeAvatar);
router.patch("/:id", verifyToken, upload.none(), updateUserInfo);

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE FRIENDS
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);



export default router;
