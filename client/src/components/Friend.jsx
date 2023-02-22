import React, { useState } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FlexBetweenBox, UserImage } from "./index";
import { patchFriend } from "./../store/index";
import { setListFix } from "./FriendListWidget/friendListWidgetSlice";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  isInProfilePage = false,
}) => {
  const [patchFriendStatus, setPatchFriendStatus] = useState("idle");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { friends, _id } = useSelector((state) => state.auth.user);
  const { friendList } = useSelector((state) => state.friendListWidget);
  const currentFriends = isInProfilePage ? friendList : friends;
  const { palette } = useTheme();
  const isFriend = currentFriends.find((friend) => friend._id === friendId);
  const isMyPost = _id === friendId;

  const onPatchFriend = () => {
    setPatchFriendStatus("loading");
    dispatch(patchFriend({ _id, friendId, token })).then(() => {
      setPatchFriendStatus("idle");
      dispatch(setListFix());
      // navigate(0);
    });
  };

  const onNavigate = () => {
    navigate(`/profile/${friendId}`);
    navigate(0);
  };

  return (
    <FlexBetweenBox width="100%">
      <FlexBetweenBox gap="10px">
        <UserImage image={userPicturePath} size="55px" navigate={onNavigate} />
        <Box>
          <Typography
            onClick={onNavigate}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": { color: palette.primary.main, cursor: "pointer" },
            }}
          >
            {name}
          </Typography>
          <Typography>{subtitle}</Typography>
        </Box>
      </FlexBetweenBox>
      {!isMyPost && (
        <IconButton onClick={onPatchFriend}>
          {isFriend && patchFriendStatus === "idle" ? (
            <PersonRemoveOutlined
              sx={{
                color: palette.primary.main,
                width: "25px",
                height: "25px",
              }}
            />
          ) : !isFriend && patchFriendStatus === "idle" ? (
            <PersonAddOutlined
              sx={{
                color: palette.primary.main,
                width: "25px",
                height: "25px",
              }}
            />
          ) : (
            <CircularProgress size={26} />
          )}
        </IconButton>
      )}
    </FlexBetweenBox>
  );
};

export default Friend;
