import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonRemoveOutlined,
  PersonAddOutlined,
  Edit,
  Save,
  Close,
  AddAPhoto,
} from "@mui/icons-material";
import ContentLoader from "react-content-loader";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  IconButton,
  InputBase,
} from "@mui/material";
import { FlexBetweenBox, WidgetWrapper, PhotoModal } from "components";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData, setUserFix } from "./userWidgetSlice";
import { patchFriend, updateUserData } from "../../store";
import { setListFix } from "components/FriendListWidget/friendListWidgetSlice";
import { setPostsReloadFix } from "components/PostsWidgets/postsWidgetsSlice";

const UserWidget = ({ userId, picturePath }) => {
  const user = useSelector((state) => state.userWidget.userData);
  const loggedInUser = useSelector((state) => state.auth.user);
  const isMyUserWidget = loggedInUser._id === userId;
  const currentUser = isMyUserWidget ? loggedInUser : user;
  const { firstName, lastName, location, occupation } = user;
  const [changedAvatar, setChangedAvatar] = useState(null);
  const [changedAvatarUrl, setChangedAvatarUrl] = useState(null);
  const [locationEditedText, setLocationEditedText] = useState(
    loggedInUser.location
  );
  const [occupationEditedText, setOccupationEditedText] = useState(
    loggedInUser.occupation
  );
  const [isLocationEdited, setIsLocationEdited] = useState(false);
  const [isOccupationEdited, setIsOccupationEdited] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [patchFriendStatus, setPatchFriendStatus] = useState("idle");
  const { listFixState } = useSelector((state) => state.friendListWidget);
  const { userFixState } = useSelector((state) => state.userWidget);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const userWidgetLoadingStatus = useSelector(
    (state) => state.userWidget.userLoadingStatus
  );
  const isFriend = !!loggedInUser.friends.find((user) => user._id === userId);
  const { palette } = useTheme();
  const locationRef = useRef(null);
  const occupationRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserData({ userId, token }));
  }, [userFixState, listFixState]);

  useEffect(() => {
    focusInputs(locationRef);
  }, [isLocationEdited]);

  useEffect(() => {
    focusInputs(occupationRef);
  }, [isOccupationEdited]);

  const focusInputs = (ref) => {
    if (ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        ref.current.value.length,
        ref.current.value.length
      );
    }
  };

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

  const onEditLocation = () => {
    setIsLocationEdited(true);
  };

  const onEditOccupation = () => {
    setIsOccupationEdited(true);
  };

  const onSaveEditedLocation = () => {
    const formData = new FormData();
    formData.append("location", locationEditedText);
    formData.append("occupation", occupation);
    dispatch(updateUserData({ id: loggedInUser._id, formData, token }));
    setIsLocationEdited(false);
    dispatch(setUserFix());
    dispatch(setListFix());
  };

  const onSaveEditedOccupation = () => {
    const formData = new FormData();
    formData.append("location", location);
    formData.append("occupation", occupationEditedText);
    dispatch(updateUserData({ id: loggedInUser._id, formData, token }));
    setIsOccupationEdited(false);
    dispatch(setUserFix());
    dispatch(setListFix());
  };

  const onChangeAvatar = (e) => {
    const avatar = e.target.files[0];
    if (avatar) {
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onload = () => {
        setChangedAvatar(avatar);
        setChangedAvatarUrl(reader.result);
      };
    }
  };

  const onSaveChangedAvatar = () => {
    const formData = new FormData();
    formData.append("picture", changedAvatar);
    formData.append("picturePath", changedAvatar.name);
    dispatch(
      updateUserData({ id: `${loggedInUser._id}/avatar`, formData, token })
    ).then(() => {
      setChangedAvatar(null);
      setChangedAvatarUrl(null);
      dispatch(setListFix());
      dispatch(setPostsReloadFix());
    });
  };

  const onCancelChangeAvatar = () => {
    setChangedAvatar(null);
    setChangedAvatarUrl(null);
  };

  if (
    (userWidgetLoadingStatus === "loading" && !user) ||
    userWidgetLoadingStatus === "error"
  )
    return <UserWidgetSkeleton />;

  return (
    <Box>
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetweenBox gap="10px" pb="10px" sx={{ maxHeight: "80px" }}>
          <FlexBetweenBox gap="20px">
            <Box width="60px" height="60px">
              <img
                src={`${
                  changedAvatar === null
                    ? `http://localhost:3001/assets/${currentUser.picturePath}`
                    : changedAvatarUrl
                } `}
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
                {user?.friends?.length}{" "}
                {user?.friends?.length === 1 ? "friend" : "friends"}
              </Typography>
            </Box>
          </FlexBetweenBox>
          {isMyUserWidget && changedAvatar === null ? (
            <IconButton component="label">
              <AddAPhoto
                sx={{
                  "&:hover": {
                    color: palette.primary.main,
                    cursor: "pointer",
                  },
                }}
              />
              <input
                type="file"
                hidden
                accept="image/png, image/jpg, image/jpeg"
                onChange={onChangeAvatar}
              />
            </IconButton>
          ) : isMyUserWidget && changedAvatar !== null ? (
            <Box display="flex" flexDirection="column">
              <IconButton
                onClick={onCancelChangeAvatar}
                sx={{ padding: "3px" }}
              >
                <Close
                  sx={{
                    "&:hover": {
                      color: palette.primary.main,
                      cursor: "pointer",
                    },
                  }}
                />
              </IconButton>
              <IconButton onClick={onSaveChangedAvatar} sx={{ padding: "3px" }}>
                <Save
                  sx={{
                    "&:hover": {
                      color: palette.primary.main,
                      cursor: "pointer",
                    },
                  }}
                />
              </IconButton>
            </Box>
          ) : null}

          {isFriend && patchFriendStatus === "idle" && !isMyUserWidget ? (
            <IconButton onClick={onPatchFriend}>
              <PersonRemoveOutlined
                sx={{
                  color: palette.primary.main,
                  width: "25px",
                  height: "25px",
                }}
              />
            </IconButton>
          ) : !isFriend && patchFriendStatus === "idle" && !isMyUserWidget ? (
            <IconButton onClick={onPatchFriend}>
              <PersonAddOutlined
                sx={{
                  color: palette.primary.main,
                  width: "25px",
                  height: "25px",
                }}
              />
            </IconButton>
          ) : patchFriendStatus === "loading" ? (
            <CircularProgress size={26} />
          ) : null}
        </FlexBetweenBox>
        <Divider />
        {/* SECOND ROW */}
        <Box py="10px">
          <FlexBetweenBox gap="10px" mb="5px">
            <Box
              display="flex"
              alignItems="center"
              gap="10px"
              sx={{ width: "90%", height: "28px" }}
            >
              <LocationOnOutlined sx={{ color: palette.primary.main }} />

              {isMyUserWidget && isLocationEdited ? (
                <InputBase
                  inputRef={locationRef}
                  onChange={(e) => setLocationEditedText(e.target.value)}
                  value={locationEditedText}
                  sx={{
                    width: "100%",
                    backgroundColor: "transparent",
                    paddingLeft: "10px",
                    borderRadius: "15px",
                    boxShadow: `0px 0px 6px ${palette.primary.main}`,
                  }}
                />
              ) : (
                <Typography>{location}</Typography>
              )}
            </Box>

            {isMyUserWidget && !isLocationEdited ? (
              <IconButton onClick={onEditLocation} sx={{ padding: "3px" }}>
                <Edit sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
            ) : isMyUserWidget && isLocationEdited ? (
              <IconButton
                onClick={onSaveEditedLocation}
                sx={{ padding: "3px" }}
              >
                <Save sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
            ) : null}
          </FlexBetweenBox>

          <FlexBetweenBox gap="10px">
            <Box
              display="flex"
              alignItems="center"
              gap="10px"
              sx={{ width: "90%", height: "28px" }}
            >
              <WorkOutlineOutlined sx={{ color: palette.primary.main }} />

              {isMyUserWidget && isOccupationEdited ? (
                <InputBase
                  inputRef={occupationRef}
                  onChange={(e) => setOccupationEditedText(e.target.value)}
                  value={occupationEditedText}
                  sx={{
                    width: "100%",
                    backgroundColor: "transparent",
                    paddingLeft: "10px",
                    borderRadius: "15px",
                    boxShadow: `0px 0px 6px ${palette.primary.main}`,
                  }}
                />
              ) : (
                <Typography>{occupation}</Typography>
              )}
            </Box>

            {isMyUserWidget && !isOccupationEdited ? (
              <IconButton onClick={onEditOccupation} sx={{ padding: "3px" }}>
                <Edit sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
            ) : isMyUserWidget && isOccupationEdited ? (
              <IconButton
                onClick={onSaveEditedOccupation}
                sx={{ padding: "3px" }}
              >
                <Save sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
            ) : null}
          </FlexBetweenBox>
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
          </FlexBetweenBox>
        </Box>
      </WidgetWrapper>

      {isPhotoModalOpen && (
        <PhotoModal
          image={currentUser.picturePath}
          alt={currentUser.firstName}
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
