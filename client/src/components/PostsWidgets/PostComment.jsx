import React from "react";
import { Box, Divider, IconButton, Typography, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { UserImage, FlexBetweenBox } from "../index";
import { deleteComment } from "./postsWidgetsSlice";

export const PostComment = ({
  commentId,
  postId,
  userId,
  name,
  userPicturePath,
  text,
  createdAt,
}) => {
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const commentCreatedTime = new Date(Date.parse(createdAt))
    .toLocaleString()
    .slice(0, -3);
  const isMyComment = loggedInUserId === userId;

  const onDelComment = () => {
    dispatch(deleteComment({ postId, commentId, token }));
  };

  const onNavigate = () => {
    navigate(`/profile/${userId}`);
    // navigate(0);
  };

  return (
    <Box>
      <Divider />
      <FlexBetweenBox mt="7px" gap="10px">
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}
        >
          <UserImage
            image={userPicturePath}
            size="45px"
            navigate={onNavigate}
          />
          <Box>
            <Typography
              onClick={onNavigate}
              variant="h6"
              fontWeight="500"
              sx={{
                "&:hover": { color: palette.primary.main, cursor: "pointer" },
              }}
            >
              {name}
            </Typography>
            <Typography variant="subtitle2" color="grey">
              {commentCreatedTime}
            </Typography>
          </Box>
        </Box>
        {isMyComment && (
          <IconButton
            sx={{
              "&:hover": { color: palette.primary.main, cursor: "pointer" },
            }}
            onClick={onDelComment}
          >
            <Close />
          </IconButton>
        )}
      </FlexBetweenBox>
      <Typography m="5px 0 10px 60px">{text}</Typography>
    </Box>
  );
};

export const PostCommentMemo = React.memo(PostComment);
