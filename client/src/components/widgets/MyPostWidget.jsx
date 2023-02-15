import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../store";
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
  EditOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 500px)");
  const imageNameArr = image?.name.split(".");

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage("");
    setPost("");
  };

  const handleClickPopover = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <WidgetWrapper>
      <FlexBetweenBox gap="15px">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          multiline
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: "15px",
            padding: "5px 10px",
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
            <Typography>
              {imageNameArr[0].length > 40
                ? imageNameArr[0].slice(0, 40) + "..." + imageNameArr[1]
                : image.name}
            </Typography>

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
            onChange={(e) => setImage(e.target.files[0])}
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
