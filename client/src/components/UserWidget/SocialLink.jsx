import React, { useEffect, useState, useRef } from "react";
import parseUrl from "url-parse";
import { Link } from "react-router-dom";
import { Save, Edit, DeleteForeverRounded, Close } from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  IconButton,
  InputBase,
} from "@mui/material";
import { FlexBetweenBox, SocialLogos } from "components";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store";
import { setListFix } from "components/FriendListWidget/friendListWidgetSlice";
import { setUserFix } from "./userWidgetSlice";
import { fixUrl, getSocialNetwork, fixEditedUrl } from "utils";

const SocialLink = ({ links, link, userId }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);
  const isMyLink = loggedInUser._id === userId;
  const [editedLink, setEditedLink] = useState(link.link);
  const [isLinkEdited, setIsLinkEdited] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("idle");
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const inputRef = useRef(null);
  console.log(links);
  useEffect(() => {
    focusInputs(inputRef);
  }, [isLinkEdited]);

  const focusInputs = (ref) => {
    if (ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        ref.current.value.length,
        ref.current.value.length
      );
    }
  };

  const onEditLink = () => {
    setIsLinkEdited(true);
  };

  const onCancelEditLink = () => {
    setIsLinkEdited(false);
  };

  const onDeleteLink = () => {
    const updatedLinks = links.filter((item) => item.link !== link.link);
    const formData = new FormData();
    if (!updatedLinks.length) {
      formData.append("socialLinks", "");
    } else {
      updatedLinks.forEach((link, i) => {
        formData.append(`socialLinks[${i}][name]`, link.name);
        formData.append(`socialLinks[${i}][link]`, link.link);
      });
    }
    setLoadingStatus("loading");
    dispatch(
      updateUserData({
        id: loggedInUser._id,
        formData,
        token,
        initData: loggedInUser,
      })
    )
      .then(() => {
        setLoadingStatus("idle");
        dispatch(setUserFix());
        dispatch(setListFix());
      })
      .catch(() => setLoadingStatus("error"));
  };

  const onSaveEditedLink = () => {
    const index = links.findIndex((item) => item.link === link.link);
    const formData = new FormData();
    for (let i = 0; i < index; i++) {
      formData.append(`socialLinks[${i}][name]`, links[i].name);
      formData.append(`socialLinks[${i}][link]`, links[i].link);
    }
    const parsedLink = parseUrl(fixEditedUrl(fixUrl(editedLink)));
    const linkName = getSocialNetwork(parsedLink.hostname);
    formData.append(`socialLinks[${index}][name]`, linkName);
    formData.append(
      `socialLinks[${index}][link]`,
      fixEditedUrl(fixUrl(editedLink))
    );
    for (let i = index + 1; i < links.length; i++) {
      formData.append(`socialLinks[${i}][name]`, links[i].name);
      formData.append(`socialLinks[${i}][link]`, links[i].link);
    }

    setLoadingStatus("loading");
    dispatch(
      updateUserData({
        id: loggedInUser._id,
        formData,
        token,
        initData: loggedInUser,
      })
    )
      .then(() => {
        setLoadingStatus("idle");
        setIsLinkEdited(false);
        setEditedLink(fixEditedUrl(editedLink));
        dispatch(setUserFix());
        dispatch(setListFix());
      })
      .catch(() => setLoadingStatus("error"));
  };

  return (
    <FlexBetweenBox>
      {!isMyLink ? (
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link
            to={link.link}
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <SocialLogos name={link.name} hover={isHovered} />
            {link.name}
          </Link>
        </Box>
      ) : isMyLink && !isLinkEdited ? (
        <FlexBetweenBox>
          <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link
              to={link.link}
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <SocialLogos name={link.name} hover={isHovered} />
              {link.name}
            </Link>
          </Box>

          {loadingStatus === "loading" ? (
            <CircularProgress size={18} />
          ) : (
            <FlexBetweenBox>
              <IconButton onClick={onEditLink}>
                <Edit sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
              <IconButton onClick={onDeleteLink}>
                <DeleteForeverRounded
                  sx={{ "&:hover": { color: palette.primary.main } }}
                />
              </IconButton>
            </FlexBetweenBox>
          )}
        </FlexBetweenBox>
      ) : isMyLink && isLinkEdited ? (
        <FlexBetweenBox>
          <InputBase
            inputRef={inputRef}
            onChange={(e) => setEditedLink(e.target.value)}
            value={editedLink}
            sx={{
              width: "90%",
              backgroundColor: "transparent",
              paddingLeft: "10px",
              borderRadius: "15px",
              boxShadow: `0px 0px 6px ${palette.primary.main}`,
            }}
          />
          <FlexBetweenBox>
            <IconButton onClick={onSaveEditedLink}>
              <Save sx={{ "&:hover": { color: palette.primary.main } }} />
            </IconButton>
            <IconButton onClick={onCancelEditLink}>
              <Close sx={{ "&:hover": { color: palette.primary.main } }} />
            </IconButton>
          </FlexBetweenBox>
        </FlexBetweenBox>
      ) : null}
    </FlexBetweenBox>
  );
};

export default SocialLink;
