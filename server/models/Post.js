import mongoose from "mongoose";
import { CommentSchema } from "./Comment.js";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: { type: Map, of: Boolean },
    comments: { type: Array, of: CommentSchema, default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
