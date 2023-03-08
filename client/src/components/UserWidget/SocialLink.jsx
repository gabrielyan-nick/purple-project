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
  Button,
  Fade,
} from "@mui/material";
import { FlexBetweenBox, SocialLogos, ConfirmModal } from "components";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store";
import { setListFix } from "components/FriendListWidget/friendListWidgetSlice";
import { setUserFix } from "./userWidgetSlice";
import { fixUrl, getSocialNetwork, fixEditedUrl, isUrlTest } from "utils";

const SocialLink = ({ links, link, userId }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);
  const isMyLink = loggedInUser._id === userId;
  const [editedLink, setEditedLink] = useState(link.link);
  const [isLinkEdited, setIsLinkEdited] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const inputRef = useRef(null);

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
    setEditedLink(link.link);
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
        setIsModalOpen(false);
        dispatch(setUserFix());
        dispatch(setListFix());
      })
      .catch(() => setLoadingStatus("error"));
  };

  const onSaveEditedLink = () => {
    if (!(editedLink === link.link) && isUrlTest(editedLink)) {
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
    } else if (editedLink === link.link) {
      setLoadingStatus("idle");
      setIsLinkEdited(false);
      setEditedLink(fixEditedUrl(editedLink));
    }
  };

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <FlexBetweenBox height="30px">
        {!isMyLink ? (
          <Box
            height="30px"
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
                color: palette.primary.main,
              }}
            >
              <SocialLogos name={link.name} hover={isHovered} />
              {link.name}
            </Link>
          </Box>
        ) : isMyLink && !isLinkEdited ? (
          <FlexBetweenBox height="30px" width="100%">
            <FlexBetweenBox
              width="100%"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Box height="30px">
                <Link
                  to={link.link}
                  target="_blank"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    textDecoration: "none",
                    color: palette.primary.main,
                  }}
                >
                  <SocialLogos name={link.name} hover={isHovered} />
                  {link.name}
                </Link>
              </Box>

              {loadingStatus === "loading" ? (
                <CircularProgress size={18} />
              ) : (
                <FlexBetweenBox
                  sx={{ visibility: `${isHovered ? "visible" : "hidden"}` }}
                >
                  <IconButton onClick={onEditLink} size="small">
                    <Edit sx={{ "&:hover": { color: palette.primary.main } }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setIsModalOpen(true)}>
                    <DeleteForeverRounded
                      sx={{ "&:hover": { color: palette.primary.main } }}
                    />
                  </IconButton>
                </FlexBetweenBox>
              )}
            </FlexBetweenBox>
          </FlexBetweenBox>
        ) : isMyLink && isLinkEdited ? (
          <FlexBetweenBox width="100%" gap="10px">
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
              <IconButton onClick={onSaveEditedLink} size="small">
                <Save sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
              <IconButton onClick={onCancelEditLink} size="small">
                <Close sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
            </FlexBetweenBox>
          </FlexBetweenBox>
        ) : null}
      </FlexBetweenBox>

      <ConfirmModal
        opened={isModalOpen}
        closeModal={onModalClose}
        action={onDeleteLink}
      >
        Do you really want to remove this link?
      </ConfirmModal>
    </>
  );
};

export default SocialLink;
