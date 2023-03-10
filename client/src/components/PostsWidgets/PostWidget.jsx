import React, { useState, useRef, useEffect, memo, forwardRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  Edit,
  Save,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  FlexBetweenBox,
  Friend,
  WidgetWrapper,
  PostComment,
  PhotoModal,
  ConfirmModal,
} from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  patchLike,
  addComment,
  deletePost,
  updatePost,
} from "./postsWidgetsSlice";
import { useTheme } from "@emotion/react";

const PostWidget = memo(
  forwardRef((props, ref) => {
    const {
      postId,
      postUserId,
      name,
      description,
      picturePath,
      userPicturePath,
      likes,
      comments,
      createdAt,
    } = props;
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
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [likeLoadingStatus, setLikeLoadingStatus] = useState("idle");
    const [addCommentLoadingStatus, setAddCommentLoadingStatus] =
      useState("idle");
    const postRef = useRef(null);
    const commentRef = useRef(null);

    const onPatchLike = () => {
      setLikeLoadingStatus("loading");
      dispatch(patchLike({ postId, token, loggedInUserId })).then(() =>
        setLikeLoadingStatus("idle")
      );
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
      setAddCommentLoadingStatus("loading");
      dispatch(addComment({ postId, data, token })).then(() => {
        setComment("");
        setAddCommentLoadingStatus("idle");
      });
    };

    const changeEditingComment = (value) => {
      setIsEditingComment(value);
    };

    const onOpenDelModal = () => {
      setIsDelModalOpen(true);
    };

    const onCloseDelModal = () => {
      setIsDelModalOpen(false);
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
        <WidgetWrapper ref={ref}>
          <FlexBetweenBox>
            <Friend
              friendId={postUserId}
              name={name}
              subtitle={postCreatedTime}
              userPicturePath={userPicturePath}
            />
            {isMyPost && !isPostEditing ? (
              <Box display="flex">
                <IconButton
                  size="small"
                  sx={{
                    height: "30px",
                    marginTop: "-35px",
                    "&:hover": {
                      color: palette.primary.main,
                      cursor: "pointer",
                    },
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
                    "&:hover": {
                      color: palette.primary.main,
                      cursor: "pointer",
                    },
                  }}
                  onClick={onOpenDelModal}
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

          {isMyPost && isPostEditing ? (
            <InputBase
              inputRef={postRef}
              onChange={(e) => setPostEditedText(e.target.value)}
              value={postEditedText}
              multiline
              sx={{
                width: "95%",
                backgroundColor: "transparent",
                marginTop: "10px",
                paddingLeft: "10px",
                lineHeight: 1.5,
                borderRadius: "15px",
                boxShadow: `0px 0px 6px ${palette.primary.main}`,
              }}
            />
          ) : (
            <Typography
              fontWeight="500"
              mt="10px"
              sx={{ wordWrap: "break-word" }}
            >
              {description}
            </Typography>
          )}

          {picturePath && (
            <img
              src={picturePath}
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
                  {likeLoadingStatus === "loading" ? (
                    <CircularProgress size={20} />
                  ) : isLiked ? (
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
          </FlexBetweenBox>

          {isComments && (
            <Box>
              <TransitionGroup component={null}>
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
                    <CSSTransition
                      classNames="comment"
                      timeout={200}
                      key={`${_id}-${createdDate}`}
                      unmountOnExit
                      mountOnEnter
                      noderef={commentRef}
                    >
                      <PostComment
                        key={_id}
                        postId={postId}
                        commentId={_id}
                        name={`${firstName} ${lastName}`}
                        userId={userId}
                        text={text}
                        userPicturePath={userPicturePath}
                        createdAt={createdDate}
                        changeEditingComment={changeEditingComment}
                        ref={commentRef}
                      />
                    </CSSTransition>
                  )
                )}
              </TransitionGroup>

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
                  {addCommentLoadingStatus === "loading" ? (
                    <Box
                      sx={{
                        width: "15%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      disabled={!comment}
                      onClick={onAddComment}
                      sx={{
                        backgroundColor: palette.buttons.loginBtn,
                        borderRadius: "5px",
                        color: "#fff",
                        width: "15%",
                        "&:hover": {
                          backgroundColor: palette.buttons.loginBtnHover,
                        },
                      }}
                    >
                      Post
                    </Button>
                  )}
                </FlexBetweenBox>
              )}
            </Box>
          )}
        </WidgetWrapper>

        <PhotoModal
          image={picturePath}
          opened={isPhotoModalOpen}
          closeModal={closePhotoModal}
        />

        <ConfirmModal
          opened={isDelModalOpen}
          closeModal={onCloseDelModal}
          action={onDelPost}
        >
          Do you really want to delete this post?
        </ConfirmModal>
      </>
    );
  })
);

export default PostWidget;
