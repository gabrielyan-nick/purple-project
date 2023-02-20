import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  addComment,
  deleteComment,
  deletePost,
  updateComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

// POST COMMENT
router.post("/:postId/comment", verifyToken, addComment);

// DELETE COMMENT
router.delete("/:postId/comment/:commentId", verifyToken, deleteComment);

// UPDATE COMMENT
router.put("/:postId/comment/:commentId", verifyToken, updateComment);

// DELETE POST
router.delete("/:postId", verifyToken, deletePost);

export default router;
