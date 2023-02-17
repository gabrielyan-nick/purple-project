import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Input,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { FlexBetweenBox, Friend, WidgetWrapper } from "./index";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchLike, addComment } from "./PostsWidget/postsWidgetSlice";
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
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const isLiked = !!likes[loggedInUserId];
  const likesCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const postCreatedTime = new Date(Date.parse(createdAt))
    .toLocaleString()
    .slice(0, -3);

  const onPatchLike = () => {
    dispatch(patchLike({ postId, token, loggedInUserId }));
  };

  const handleComment = () => {
    const data = {
      userId: loggedInUserId,
      text: comment
    }
    // const formData = new FormData();
    // formData.append("userId", `"${loggedInUserId}"`);
    // formData.append("text", `"${comment}"`);

    dispatch(addComment({ postId, data, token })).then(() =>
      setComment("")
    );
  };

  return (
    <WidgetWrapper m="10px 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography mt="5px" variant="subtitle2" color="grey">
        {postCreatedTime}
      </Typography>
      <Typography fontWeight="500">{description}</Typography>
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
            <IconButton onClick={onPatchLike}>
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
          {/* {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography m="5px 0" pl="10px">
                {comment}
              </Typography>
            </Box>
          ))} */}
          <Divider />
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
            onClick={handleComment}
            sx={{
              backgroundColor: palette.buttons.main,
              borderRadius: "5px",
              color: "#fff",
            }}
          >
            Post
          </Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
