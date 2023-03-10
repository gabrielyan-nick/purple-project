import React, { useState, useRef, useEffect, memo, forwardRef } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Button,
  InputBase,
} from "@mui/material";
import { Close, Edit, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { UserImage, FlexBetweenBox, ConfirmModal } from "../index";
import { deleteComment, updateComment } from "./postsWidgetsSlice";

const PostComment = memo(
  forwardRef((props, ref) => {
    const {
      commentId,
      postId,
      userId,
      name,
      userPicturePath,
      text,
      createdAt,
      changeEditingComment,
    } = props;
    const [editedText, setEditedText] = useState(text);
    const [isEditing, setIsEditing] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const loggedInUserId = useSelector((state) => state.auth.user._id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { palette } = useTheme();
    const commentCreatedTime = new Date(Date.parse(createdAt))
      .toLocaleString()
      .slice(0, -3);
    const isMyComment = loggedInUserId === userId;
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [delLoadingStatus, setDelLoadingStatus] = useState("idle");
    const inputRef = useRef(null);

    const onDelComment = () => {
      setDelLoadingStatus("loading");
      dispatch(deleteComment({ postId, commentId, token })).then(() =>
        setDelLoadingStatus("idle")
      );
    };

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length
        );
      }
    }, [isEditing]);

    const onEditComment = () => {
      setIsEditing(true);
      changeEditingComment(true);
    };

    const onSaveEditedComment = () => {
      const data = {
        text: editedText,
      };
      dispatch(updateComment({ postId, commentId, data, token }));
      setIsEditing(false);
      changeEditingComment(false);
    };

    const onNavigate = () => {
      navigate(`/profile/${userId}`);
    };

    const onOpenDelModal = () => {
      setIsDelModalOpen(true);
    };

    const onCloseDelModal = () => {
      setIsDelModalOpen(false);
    };

    return (
      <>
        <Box mb="10px" ref={ref}>
          <Divider />
          <FlexBetweenBox mt="7px" gap="10px">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
              }}
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
                    "&:hover": {
                      color: palette.primary.main,
                      cursor: "pointer",
                    },
                  }}
                >
                  {name}
                </Typography>
                <Typography variant="subtitle2" color="grey">
                  {commentCreatedTime}
                </Typography>
              </Box>
            </Box>
            {isMyComment && !isEditing ? (
              <Box display='flex' gap='8px'>
                <IconButton
                  size="small"
                  sx={{
                    marginTop: "-20px",
                    "&:hover": {
                      color: palette.primary.main,
                      cursor: "pointer",
                    },
                  }}
                  onClick={onEditComment}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    margin: "-20px -5px 0",
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
            ) : isMyComment && isEditing ? (
              <IconButton
                size="small"
                sx={{
                  margin: "-20px -5px 0",
                  "&:hover": { color: palette.primary.main, cursor: "pointer" },
                }}
                onClick={onSaveEditedComment}
              >
                <Save />
              </IconButton>
            ) : null}
          </FlexBetweenBox>
          {isMyComment && isEditing ? (
            <InputBase
              inputRef={inputRef}
              onChange={(e) => setEditedText(e.target.value)}
              value={editedText}
              multiline
              sx={{
                width: "90%",
                backgroundColor: "transparent",
                marginLeft: "45px",
                paddingLeft: "10px",
                lineHeight: 1.5,
                borderRadius: "15px",
                boxShadow: `0px 0px 6px ${palette.primary.main}`,
              }}
            />
          ) : (
            <Typography p="5px 0 0 55px" sx={{ wordWrap: "break-word" }}>
              {text}
            </Typography>
          )}
        </Box>

        <ConfirmModal
          opened={isDelModalOpen}
          closeModal={onCloseDelModal}
          action={onDelComment}
          actionStatus={delLoadingStatus}
        >
          Do you really want to delete this comment?
        </ConfirmModal>
      </>
    );
  })
);
export default PostComment;
