import React, { useState, useRef, useEffect } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  Edit,
  Save,
} from "@mui/icons-material";
import { Box, IconButton, InputBase, Typography, Button } from "@mui/material";
import {
  FlexBetweenBox,
  Friend,
  WidgetWrapper,
  PostCommentMemo,
  PhotoModal,
} from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  patchLike,
  addComment,
  deletePost,
  updatePost,
} from "./postsWidgetsSlice";
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
  const [postEditedText, setPostEditedText] = useState(description);
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
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
  const postRef = useRef(null);

  const onPatchLike = () => {
    dispatch(patchLike({ postId, token, loggedInUserId }));
  };

  const onDelPost = () => {
    dispatch(deletePost({ postId, token }));
  };

  const onEditPost = () => {
    setIsPostEditing(true);
  };

  const onSaveEditedPost = () => {
    const data = {
      description: postEditedText,
    };
    dispatch(updatePost({ postId, data, token }));
    setIsPostEditing(false);
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

  useEffect(() => {
    if (postRef.current) {
      postRef.current.focus();
      postRef.current.setSelectionRange(
        postRef.current.value.length,
        postRef.current.value.length
      );
    }
  }, [isPostEditing]);

  const openPhotoModal = () => setIsPhotoModalOpen(true);
  const closePhotoModal = () => setIsPhotoModalOpen(false);

  return (
    <>
      <WidgetWrapper>
        <FlexBetweenBox>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />
          {isMyPost && !isPostEditing ? (
            <Box display="flex">
              <IconButton
                size="small"
                sx={{
                  height: "30px",
                  marginTop: "-35px",
                  "&:hover": { color: palette.primary.main, cursor: "pointer" },
                }}
                onClick={onEditPost}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  height: "30px",
                  margin: "-35px -5px 0",
                  "&:hover": { color: palette.primary.main, cursor: "pointer" },
                }}
                onClick={onDelPost}
              >
                <Close />
              </IconButton>
            </Box>
          ) : isMyPost && isPostEditing ? (
            <IconButton
              size="small"
              sx={{
                margin: "-40px -5px 0",
                "&:hover": { color: palette.primary.main, cursor: "pointer" },
              }}
              onClick={onSaveEditedPost}
            >
              <Save />
            </IconButton>
          ) : null}
        </FlexBetweenBox>

        <Typography mt="5px" variant="subtitle2" color="grey">
          {postCreatedTime}
        </Typography>

        {isMyPost && isPostEditing ? (
          <InputBase
            inputRef={postRef}
            onChange={(e) => setPostEditedText(e.target.value)}
            value={postEditedText}
            multiline
            sx={{
              width: "95%",
              backgroundColor: "transparent",
              marginTop: "5px",
              paddingLeft: "10px",
              lineHeight: 1.5,
              borderRadius: "15px",
              boxShadow: `0px 0px 6px ${palette.primary.main}`,
            }}
          />
        ) : (
          <Typography fontWeight="500" mt="5px" sx={{ wordWrap: "break-word" }}>
            {description}
          </Typography>
        )}

        {picturePath && (
          <img
            src={`http://localhost:3001/assets/${picturePath}`}
            alt="post"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "5px",
              marginTop: "10px",
              cursor: "pointer",
            }}
            onClick={openPhotoModal}
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
              <IconButton
                size="small"
                onClick={() => setIsComments(!isComments)}
              >
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
                    "&:hover": { backgroundColor: palette.buttons.main },
                  }}
                >
                  Post
                </Button>
              </FlexBetweenBox>
            )}
          </Box>
        )}
      </WidgetWrapper>
      {isPhotoModalOpen && (
        <PhotoModal image={picturePath} closeModal={closePhotoModal} />
      )}
    </>
  );
};

export const PostWidgetMemo = React.memo(PostWidget);
