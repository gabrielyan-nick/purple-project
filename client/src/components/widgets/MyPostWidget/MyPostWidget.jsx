import { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../../store";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Dropzone from "react-dropzone";
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
import "./styles.scss";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dropzoneRef = useRef(null);

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

  return (
    <WidgetWrapper>
      <FlexBetweenBox gap="15px">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: "15px",
            padding: "5px 10px",
            boxShadow: `0px 0px 6px ${palette.primary.main}`,
          }}
        />
      </FlexBetweenBox>
      {isImage && (
        <CSSTransition
          nodeRef={dropzoneRef}
          in={isImage}
          timeout={0}
          classNames="dropzone"
          appear={isImage}
        >
          <Box
            ref={dropzoneRef}
            sx={{
              boxShadow: `0px 0px 6px ${palette.primary.main}`,
              borderRadius: "5px",
            }}
            p={1}
            mt="10px"
            className="dropzone"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              style={{ width: "100%" }}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetweenBox gap="5px">
                  <Box
                    {...getRootProps()}
                    p={1}
                    sx={{
                      "&:hover": { cursor: "pointer" },
                      border: `1px dashed #4a148c`,
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50px",
                    }}
                  >
                    <input {...getInputProps()} />

                    {!image ? (
                      <p>Add image here</p>
                    ) : (
                      <FlexBetweenBox>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetweenBox>
                    )}
                  </Box>
                  {image && (
                    <IconButton onClick={() => setImage(null)}>
                      <DeleteOutlined sx={{ color: palette.primary.main }} />
                    </IconButton>
                  )}
                </FlexBetweenBox>
              )}
            </Dropzone>
          </Box>
        </CSSTransition>
      )}
      <Divider sx={{ margin: "10px 0" }} />

      <FlexBetweenBox>
        <FlexBetweenBox
          gap="10px"
          onClick={() => setIsImage(!isImage)}
          sx={{ cursor: "pointer" }}
        >
          <ImageOutlined sx={{ color: palette.primary.main }} />
          <Typography>Image</Typography>
        </FlexBetweenBox>

        {isNonMobileScreens ? (
          <>
            <FlexBetweenBox gap="10px" sx={{ cursor: "pointer" }}>
              <GifBoxOutlined sx={{ color: palette.primary.main }} />
              <Typography>Clip</Typography>
            </FlexBetweenBox>
            <FlexBetweenBox gap="10px" sx={{ cursor: "pointer" }}>
              <AttachFileOutlined sx={{ color: palette.primary.main }} />
              <Typography>Attachment</Typography>
            </FlexBetweenBox>
            <FlexBetweenBox gap="10px" sx={{ cursor: "pointer" }}>
              <MicOutlined sx={{ color: palette.primary.main }} />
              <Typography>Audio</Typography>
            </FlexBetweenBox>
          </>
        ) : (
          <>
            <FlexBetweenBox gap="10px">
              <MoreHorizOutlined sx={{ color: palette.primary.main }} />
            </FlexBetweenBox>
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
