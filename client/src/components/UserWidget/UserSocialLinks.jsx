import React, { useEffect, useState, useRef } from "react";
import parseUrl from "url-parse";
import { Link } from "react-router-dom";
import { Edit, Save, Close } from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  IconButton,
  InputBase,
  Button,
  Fade,
} from "@mui/material";
import { FlexBetweenBox, SocialLink } from "components";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store";
import { setListFix } from "components/FriendListWidget/friendListWidgetSlice";
import { setUserFix } from "./userWidgetSlice";
import { fixUrl, getSocialNetwork } from "utils";

const UserSocialLinks = ({ links, userId }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);
  const isMyUserWidget = loggedInUser._id === userId;
  const [isAddedLink, setIsAddedLink] = useState(false);
  const [linkEditedText, setLinkEditedText] = useState("");
  const [saveLoadingStatus, setSaveLoadingStatus] = useState("idle");
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    focusInputs(inputRef);
  }, [isAddedLink]);

  const focusInputs = (ref) => {
    if (ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        ref.current.value.length,
        ref.current.value.length
      );
    }
  };

  const onAddLink = () => {
    setIsAddedLink(true);
  };

  const onCancelAddLink = () => {
    setIsAddedLink(false);
    setLinkEditedText("");
  };

  const onSaveLink = () => {
    const parsedLink = parseUrl(fixUrl(linkEditedText));
    const linkName = getSocialNetwork(parsedLink.hostname);
    const formData = new FormData();

    links.forEach((link, i) => {
      formData.append(`socialLinks[${i}][name]`, link.name);
      formData.append(`socialLinks[${i}][link]`, link.link);
    });
    formData.append(`socialLinks[${links.length}][name]`, linkName);
    formData.append(
      `socialLinks[${links.length}][link]`,
      fixUrl(linkEditedText)
    );

    setSaveLoadingStatus("loading");
    dispatch(
      updateUserData({
        id: loggedInUser._id,
        formData,
        token,
        initData: loggedInUser,
      })
    )
      .then(() => {
        setSaveLoadingStatus("idle");
        setIsAddedLink(false);
        setLinkEditedText("");
        dispatch(setUserFix());
        dispatch(setListFix());
      })
      .catch(() => setSaveLoadingStatus("error"));
  };

  return (
    <Box py="10px">
      <Typography fontWeight="500">Social profiles</Typography>

      <Box>
        {links?.length === 0 ? (
          <Typography mt="10px" variant="subtitle1" color="grey">
            No links
          </Typography>
        ) : (
          links?.map((link, i) => (
            <SocialLink
              key={`${link}-${i}`}
              links={links}
              link={link}
              userId={userId}
            />
          ))
        )}
      </Box>

      {isMyUserWidget && (
        <Box>
          {saveLoadingStatus === "loading" ? (
            <CircularProgress size={18} />
          ) : !isAddedLink ? (
            <Button
              variant="text"
              sx={{
                "&:hover": { backgroundColor: palette.buttons.hover },
                marginTop: "5px",
              }}
              onClick={onAddLink}
            >
              Add link
            </Button>
          ) : (
            <Fade in={isAddedLink} timeout={400}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap="10px"
                mt="15px"
              >
                <InputBase
                  inputRef={inputRef}
                  onChange={(e) => setLinkEditedText(e.target.value)}
                  value={linkEditedText}
                  sx={{
                    width: "90%",
                    height: "28px",
                    backgroundColor: "transparent",
                    paddingLeft: "10px",
                    borderRadius: "15px",
                    boxShadow: `0px 0px 6px ${palette.primary.main}`,
                  }}
                />
                <Box display="flex" justifyContent="space-between">
                  <IconButton onClick={onSaveLink} size="small">
                    <Save sx={{ "&:hover": { color: palette.primary.main } }} />
                  </IconButton>
                  <IconButton onClick={onCancelAddLink} size="small">
                    <Close
                      sx={{ "&:hover": { color: palette.primary.main } }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserSocialLinks;
