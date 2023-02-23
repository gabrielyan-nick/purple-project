import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserInfo
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE FRIENDS
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// UPDATE USER INFO
router.patch("/:id", verifyToken, updateUserInfo) 

export default router;
