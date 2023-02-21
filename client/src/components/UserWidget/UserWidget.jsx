import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import ContentLoader from "react-content-loader";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { UserImage, FlexBetweenBox, WidgetWrapper } from "components";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "./userWidgetSlice";

const UserWidget = ({ userId, picturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const loggedInUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.userWidget.userData);
  const userWidgetLoadingStatus = useSelector(
    (state) => state.userWidget.userLoadingStatus
  );
  const isMyUserWidget = loggedInUserId === userId;

  useEffect(() => {
    dispatch(fetchUserData({ userId, token }));
  }, []);

  const onNavigate = () => {
    navigate(`/profile/${userId}`);
  };

  if (
    userWidgetLoadingStatus === "loading" ||
    userWidgetLoadingStatus === "error"
  )
    return <UserWidgetSkeleton />;

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetweenBox gap="10px" pb="10px">
        <FlexBetweenBox gap="20px">
          <UserImage image={picturePath} navigate={onNavigate} />
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
              {isMyUserWidget ? loggedInUser.friends.length : friends.length}{" "}
              friends
            </Typography>
          </Box>
        </FlexBetweenBox>
        {isMyUserWidget && (
          <ManageAccountsOutlined
            sx={{ color: palette.primary.main, cursor: "pointer" }}
          />
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
        <FlexBetweenBox mb="10px">
          <Typography>Who's viewed your profile</Typography>
          <Typography fontWeight="500">{viewedProfile}</Typography>
        </FlexBetweenBox>
        <FlexBetweenBox>
          <Typography>Impressions of your post</Typography>
          <Typography fontWeight="500">{impressions}</Typography>
        </FlexBetweenBox>
      </Box>
      <Divider />
      {/* FOURTH ROW */}
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
