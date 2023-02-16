import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { FlexBetweenBox, Friend, WidgetWrapper } from "./index";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "./../store";
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
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const isLiked = !!likes[loggedInUserId];
  const likesCount = Object.keys(likes).length;
  const { palette } = useTheme();

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="10px 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography>{description}</Typography>
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
      <FlexBetweenBox mt="7px">
        <FlexBetweenBox gap="10px">
          <FlexBetweenBox gap="5px">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: palette.primary.main }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likesCount}</Typography>
          </FlexBetweenBox>

          <FlexBetweenBox gap="5px">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetweenBox>
        </FlexBetweenBox>

        <IconButton>
          <ShareOutlined sx={{ color: palette.primary.main }} />
        </IconButton>
      </FlexBetweenBox>
      {isComments && (
        <Box mt="5px">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography m="5px 0" pl="10px">
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
