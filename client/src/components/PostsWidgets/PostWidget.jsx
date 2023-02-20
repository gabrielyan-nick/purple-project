import React from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
} from "@mui/icons-material";
import { Box, IconButton, InputBase, Typography, Button } from "@mui/material";
import {
  FlexBetweenBox,
  Friend,
  WidgetWrapper,
  PostCommentMemo,
} from "../index";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchLike, addComment, deletePost } from "./postsWidgetsSlice";
import { useTheme } from "@emotion/react";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const isLiked = !!likes[loggedInUserId];
  const likesCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const postCreatedTime = new Date(Date.parse(createdAt))
    .toLocaleString()
    .slice(0, -3);
  const isMyPost = loggedInUserId === postUserId;

  const onPatchLike = () => {
    dispatch(patchLike({ postId, token, loggedInUserId }));
  };

  const onDelPost = () => {
    dispatch(deletePost({ postId, token }));
  };

  const onAddComment = () => {
    const data = {
      userId: loggedInUserId,
      text: comment,
    };
    dispatch(addComment({ postId, data, token })).then(() => setComment(""));
  };

  const changeEditingComment = (value) => {
    setIsEditingComment(value);
  };

  return (
    <WidgetWrapper m="10px 0">
      <FlexBetweenBox>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        {isMyPost && (
          <IconButton
            size="small"
            sx={{
              alignSelf: "flex-start",
              margin: "-10px -5px 0",
              "&:hover": { color: palette.primary.main, cursor: "pointer" },
            }}
            onClick={onDelPost}
          >
            <Close />
          </IconButton>
        )}
      </FlexBetweenBox>

      <Typography mt="5px" variant="subtitle2" color="grey">
        {postCreatedTime}
      </Typography>
      <Typography fontWeight="500" mt="5px">
        {description}
      </Typography>
      {picturePath && (
        <img
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="post"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        />
      )}
      <FlexBetweenBox m="7px 0 5px">
        <FlexBetweenBox gap="10px">
          <FlexBetweenBox gap="5px">
            <IconButton size="small" onClick={onPatchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: palette.primary.main }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likesCount}</Typography>
          </FlexBetweenBox>

          <FlexBetweenBox gap="5px">
            <IconButton size="small" onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetweenBox>
        </FlexBetweenBox>

        <IconButton size="small" sx={{ marginRight: "-5px" }}>
          <ShareOutlined sx={{ color: palette.primary.main }} />
        </IconButton>
      </FlexBetweenBox>

      {isComments && (
        <Box>
          {comments.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              userPicturePath,
              text,
              createdDate,
            }) => (
              <PostCommentMemo
                key={_id}
                postId={postId}
                commentId={_id}
                name={`${firstName} ${lastName}`}
                userId={userId}
                text={text}
                userPicturePath={userPicturePath}
                createdAt={createdDate}
                changeEditingComment={changeEditingComment}
              />
            )
          )}
          {!isEditingComment && (
            <FlexBetweenBox gap="10px" m="20px 0 5px 0">
              <InputBase
                placeholder="Add comment"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                multiline
                sx={{
                  width: "100%",
                  backgroundColor: "transparent",
                  borderRadius: "15px",
                  padding: "10px",
                  boxShadow: `0px 0px 6px ${palette.primary.main}`,
                }}
              />
              <Button
                variant="contained"
                disabled={!comment}
                onClick={onAddComment}
                sx={{
                  backgroundColor: palette.buttons.main,
                  borderRadius: "5px",
                  color: "#fff",
                  width: "15%",
                }}
              >
                Post
              </Button>
            </FlexBetweenBox>
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export const PostWidgetMemo = React.memo(PostWidget);
