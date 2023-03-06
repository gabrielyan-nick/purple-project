import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { storage } from "../../firebase";
import {
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
import {
  FlexBetweenBox,
  WidgetWrapper,
  PhotoModal,
  UserWidgetInput,
  UserSocialLinks,
} from "components";
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
  const { token } = useSelector((state) => state.auth);
  const isMyUserWidget = loggedInUser._id === userId;
  const currentUser = isMyUserWidget ? loggedInUser : user;
  const { firstName, lastName, location, occupation } = user;
  const [changedAvatar, setChangedAvatar] = useState(null);
  const [changedAvatarUrl, setChangedAvatarUrl] = useState(null);
  const [avatarLoadingStatus, setAvatarLoadingStatus] = useState("idle");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [patchFriendStatus, setPatchFriendStatus] = useState("idle");
  const { listFixState } = useSelector((state) => state.friendListWidget);
  const { userFixState } = useSelector((state) => state.userWidget);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userWidgetLoadingStatus = useSelector(
    (state) => state.userWidget.userLoadingStatus
  );
  const isFriend = !!loggedInUser.friends.find((user) => user._id === userId);
  const { palette } = useTheme();

  useEffect(() => {
    dispatch(fetchUserData({ userId, token }));
  }, [userFixState, listFixState]);

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
    });
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

  const onSaveChangedAvatar = async () => {
    const imageRef = ref(storage, `${loggedInUser._id}/${changedAvatar.name}`);
    uploadBytes(imageRef, changedAvatar)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            const formData = new FormData();
            formData.append("picturePath", url);
            setAvatarLoadingStatus("loading");
            dispatch(
              updateUserData({
                id: `${loggedInUser._id}/avatar`,
                formData,
                token,
                initData: loggedInUser,
              })
            ).then(() => {
              setAvatarLoadingStatus("idle");
              setChangedAvatar(null);
              setChangedAvatarUrl(null);
              dispatch(setListFix());
              dispatch(setPostsReloadFix());
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
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
                    ? currentUser.picturePath
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
          {avatarLoadingStatus === "loading" ? (
            <CircularProgress size={30} />
          ) : isMyUserWidget && changedAvatar === null ? (
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
          <UserWidgetInput
            userId={userId}
            displayedInfo={location}
            initText={loggedInUser.location}
            typeOfData="location"
          />
          <UserWidgetInput
            userId={userId}
            displayedInfo={occupation}
            initText={loggedInUser.occupation}
            typeOfData="occupation"
          />
        </Box>
        <Divider />
        {/* THIRD ROW */}
        <UserSocialLinks links={user.socialLinks} userId={userId} />
      </WidgetWrapper>

      <PhotoModal
        image={
          changedAvatarUrl !== null ? changedAvatarUrl : currentUser.picturePath
        }
        alt={currentUser.firstName}
        opened={isPhotoModalOpen}
        closeModal={closePhotoModal}
      />
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
