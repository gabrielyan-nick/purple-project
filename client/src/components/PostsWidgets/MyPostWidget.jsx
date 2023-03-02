import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMyPost } from "./postsWidgetsSlice";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Popover,
  Fade,
} from "@mui/material";
import { FlexBetweenBox, WidgetWrapper, UserImage } from "components";
import {
  AttachFileOutlined,
  DeleteOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import { setPostsReloadFix } from "./postsWidgetsSlice";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [post, setPost] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { palette } = useTheme();
  const _id = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);
  const initPosts = useSelector((state) => state.postsWidget.posts);
  const isNonMobileScreens = useMediaQuery("(min-width: 500px)");
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(`/profile/${_id}`);
  };

  const onAddImage = async (e) => {
    const img = e.target.files[0];
    setImage(img);
    if (img) {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
    }
  };

  const addPost = async (url = false) => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (url) {
      formData.append("picturePath", url);
    }
    dispatch(addMyPost({ formData, token, initPosts })).then(() => {
      setImage(null);
      setPost("");
      dispatch(setPostsReloadFix());
    });
  };

  const handlePost = () => {
    if (image) {
      const imageRef = ref(storage, `${_id}/${image.name}`);
      uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              addPost(url);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      addPost();
    }
  };

  const handleClickPopover = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <WidgetWrapper sx={{ marginBottom: "20px" }}>
      <FlexBetweenBox gap="15px">
        <UserImage image={picturePath} navigate={onNavigate} />
        <InputBase
          placeholder="What's on your mind?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          multiline
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: "15px",
            padding: "10px",
            boxShadow: `0px 0px 6px ${palette.primary.main}`,
          }}
        />
      </FlexBetweenBox>

      {image && (
        <Fade in={!!image} timeout={300}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <img
              src={imageUrl}
              alt={image.name.slice(0, 20)}
              style={{ maxWidth: "200px" }}
            />

            <IconButton onClick={() => setImage(null)}>
              <DeleteOutlined sx={{ color: palette.primary.main }} />
            </IconButton>
          </Box>
        </Fade>
      )}

      <Divider sx={{ margin: "10px 0" }} />

      <FlexBetweenBox>
        <Button
          variant="text"
          component="label"
          sx={{ textTransform: "capitalize" }}
        >
          <FlexBetweenBox gap="5px" sx={{ cursor: "pointer" }}>
            <ImageOutlined sx={{ color: palette.primary.main }} />
            <Typography>Image</Typography>
          </FlexBetweenBox>
          <input
            type="file"
            hidden
            accept="image/png, image/jpg, image/jpeg"
            onChange={onAddImage}
          />
        </Button>

        {isNonMobileScreens ? (
          <AddFileBtns />
        ) : (
          <>
            <Box>
              <IconButton onClick={handleClickPopover}>
                <MoreHorizOutlined sx={{ color: palette.primary.main }} />
              </IconButton>
              <Popover
                open={!!anchorEl}
                onClose={handleClosePopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <AddFileBtns />
              </Popover>
            </Box>
          </>
        )}

        <Button
          variant="contained"
          disabled={!image && !post}
          onClick={handlePost}
          sx={{
            backgroundColor: palette.buttons.main,
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          Post
        </Button>
      </FlexBetweenBox>
    </WidgetWrapper>
  );
};

export default MyPostWidget;

const AddFileBtns = () => {
  const { palette } = useTheme();
  return (
    <>
      <Button variant="text" sx={{ textTransform: "capitalize" }}>
        <FlexBetweenBox gap="5px" sx={{ cursor: "pointer" }}>
          <GifBoxOutlined sx={{ color: palette.primary.main }} />
          <Typography>Clip</Typography>
        </FlexBetweenBox>
      </Button>

      <Button variant="text" sx={{ textTransform: "capitalize" }}>
        <FlexBetweenBox gap="5px" sx={{ cursor: "pointer" }}>
          <AttachFileOutlined sx={{ color: palette.primary.main }} />
          <Typography>Attachment</Typography>
        </FlexBetweenBox>
      </Button>

      <Button variant="text" sx={{ textTransform: "capitalize" }}>
        <FlexBetweenBox gap="5px" sx={{ cursor: "pointer" }}>
          <MicOutlined sx={{ color: palette.primary.main }} />
          <Typography>Audio</Typography>
        </FlexBetweenBox>
      </Button>
    </>
  );
};
