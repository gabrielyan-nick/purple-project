import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema(
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
    userPicturePath: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    postId: {
      type: String,
      require: true,
    },
    createdDate: {
      type: Date,
      require: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
