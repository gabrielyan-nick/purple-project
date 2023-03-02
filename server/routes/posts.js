import express from "express";
import multer from "multer";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  addComment,
  deleteComment,
  deletePost,
  updatePost,
  updateComment,
  createPost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer();

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

// CREATE POST
router.post("/", verifyToken, upload.none(), createPost);

// DELETE POST
router.delete("/:postId", verifyToken, deletePost);

// UPDATE POST
router.patch("/:postId", verifyToken, updatePost);

export default router;
