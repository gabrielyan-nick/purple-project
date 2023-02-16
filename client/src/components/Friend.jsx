import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FlexBetweenBox, UserImage } from "./index";
import { setFriends } from "./../store/index";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { friends, _id } = useSelector((state) => state.auth.user);
  const { palette } = useTheme();
  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const friends = await response.json();
    dispatch(setFriends(friends));
  };

  const onNavigate = () => {
    navigate(`/profile/${friendId}`);
    // navigate(0);
  };

  return (
    <FlexBetweenBox>
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
      <IconButton onClick={() => patchFriend()}>
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: palette.primary.main }} />
        ) : (
          <PersonAddOutlined sx={{ color: palette.primary.main }} />
        )}
      </IconButton>
    </FlexBetweenBox>
  );
};

export default Friend;
