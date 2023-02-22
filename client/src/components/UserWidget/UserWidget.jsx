import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonRemoveOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import ContentLoader from "react-content-loader";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  UserImage,
  FlexBetweenBox,
  WidgetWrapper,
  PhotoModal,
} from "components";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "./userWidgetSlice";
import { patchFriend } from "../../store";
import { setListFix } from "../FriendListWidget/friendListWidgetSlice";

const UserWidget = ({ userId, picturePath }) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [patchFriendStatus, setPatchFriendStatus] = useState("idle");
  const { listFixState } = useSelector((state) => state.friendListWidget);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const userWidgetLoadingStatus = useSelector(
    (state) => state.userWidget.userLoadingStatus
  );
  const loggedInUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.userWidget.userData);
  const isMyUserWidget = loggedInUser._id === userId;
  const currentUser = isMyUserWidget ? loggedInUser : user;
  const isFriend = loggedInUser.friends.find((user) => user._id === userId);
  const { palette } = useTheme();

  useEffect(() => {
    dispatch(fetchUserData({ userId, token }));
  }, [listFixState]);

  const onNavigate = () => {
    navigate(`/profile/${userId}`);
  };

  const openPhotoModal = () => setIsPhotoModalOpen(true);
  const closePhotoModal = () => setIsPhotoModalOpen(false);

  const onPatchFriend = () => {
    setPatchFriendStatus("loading");
    dispatch(
      patchFriend({ _id: loggedInUser._id, friendId: userId, token })
    ).then(() => {
      setPatchFriendStatus("idle");
      dispatch(setListFix());
      // navigate(0);
    });
  };

  if (
    (userWidgetLoadingStatus === "loading" && !user) ||
    userWidgetLoadingStatus === "error"
  )
    return <UserWidgetSkeleton />;

  const { firstName, lastName, location, occupation, friends } = user;

  return (
    <Box>
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetweenBox gap="10px" pb="10px">
          <FlexBetweenBox gap="20px">
            <Box width="60px" height="60px">
              <img
                src={`http://localhost:3001/assets/${picturePath}`}
                alt="user"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                width="60px"
                height="60px"
                onClick={openPhotoModal}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                fontWeight="500"
                sx={{
                  cursor: "pointer",
                }}
                onClick={onNavigate}
              >
                {firstName} {lastName}
              </Typography>
              <Typography>
                {currentUser.friends.length}{" "}
                {currentUser.friends.length === 1 ? "friend" : "friends"}
              </Typography>
            </Box>
          </FlexBetweenBox>

          {isMyUserWidget ? (
            <ManageAccountsOutlined
              sx={{
                color: palette.primary.main,
                cursor: "pointer",
                width: "25px",
                height: "25px",
              }}
            />
          ) : isFriend && patchFriendStatus === "idle" ? (
            <IconButton onClick={onPatchFriend}>
              <PersonRemoveOutlined
                sx={{
                  color: palette.primary.main,
                  width: "25px",
                  height: "25px",
                }}
              />
            </IconButton>
          ) : !isFriend && patchFriendStatus === "idle" ? (
            <IconButton onClick={onPatchFriend}>
              <PersonAddOutlined
                sx={{
                  color: palette.primary.main,
                  width: "25px",
                  height: "25px",
                }}
              />
            </IconButton>
          ) : (
            <CircularProgress size={26} />
          )}
        </FlexBetweenBox>
        <Divider />
        {/* SECOND ROW */}
        <Box py="10px">
          <Box display="flex" alignItems="center" gap="10px" mb="5px">
            <LocationOnOutlined sx={{ color: palette.primary.main }} />
            <Typography>{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="10px">
            <WorkOutlineOutlined sx={{ color: palette.primary.main }} />
            <Typography>{occupation}</Typography>
          </Box>
        </Box>
        <Divider />
        {/* THIRD ROW */}
        <Box py="10px">
          <Typography fontWeight="500" mb="10px">
            Social profiles
          </Typography>

          <FlexBetweenBox gap="10px" mb="10px">
            <FlexBetweenBox gap="10px">
              <img
                src="../assets/twitter.png"
                alt="twitter"
                style={{ cursor: "pointer" }}
              />
              <Box>
                <Typography fontWeight="500" sx={{ cursor: "pointer" }}>
                  Twitter
                </Typography>
                <Typography>Social network</Typography>
              </Box>
            </FlexBetweenBox>
            <EditOutlined
              sx={{ color: palette.primary.main, cursor: "pointer" }}
            />
          </FlexBetweenBox>

          <FlexBetweenBox gap="10px">
            <FlexBetweenBox gap="10px">
              <img
                src="../assets/linkedin.png"
                alt="linkedin"
                style={{ cursor: "pointer" }}
              />
              <Box>
                <Typography fontWeight="500" sx={{ cursor: "pointer" }}>
                  LindedIn
                </Typography>
                <Typography>Network platform</Typography>
              </Box>
            </FlexBetweenBox>
            <EditOutlined
              sx={{ color: palette.primary.main, cursor: "pointer" }}
            />
          </FlexBetweenBox>
        </Box>
      </WidgetWrapper>

      {isPhotoModalOpen && (
        <PhotoModal
          image={picturePath}
          alt={firstName}
          closeModal={closePhotoModal}
        />
      )}
    </Box>
  );
};

export default UserWidget;

const UserWidgetSkeleton = () => {
  const { palette } = useTheme();
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={380}
      backgroundColor={palette.skeleton.background}
      foregroundColor={palette.skeleton.foreground}
    >
      <circle cx="45" cy="50" r="30" />
      <rect x="91" y="33" rx="4" ry="4" width="60%" height="19" />
      <rect x="91" y="56" rx="4" ry="4" width="35%" height="13" />
      <rect x="19" y="98" rx="4" ry="4" width="90%" height="55" />
      <rect x="19" y="163" rx="4" ry="4" width="90%" height="55" />
      <rect x="19" y="228" rx="4" ry="4" width="90%" height="110" />
    </ContentLoader>
  );
};
