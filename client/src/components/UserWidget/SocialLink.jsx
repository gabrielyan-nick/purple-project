import React, { useEffect, useState, useRef } from "react";
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

const SocialLink = ({ links, link, userId }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);
  const isMyLink = loggedInUser._id === userId;
  const [editedLink, setEditedLink] = useState(link.link);
  const [isLinkEdited, setIsLinkEdited] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("idle");
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
  };

  return (
    <FlexBetweenBox>
      {!isMyLink ? (
        <FlexBetweenBox className="social-link-wrapper">
          <SocialLogos name={link.name} />
          <Link to={link.link} target="_blank">
            {link.name}
          </Link>
        </FlexBetweenBox>
      ) : isMyLink && !isLinkEdited ? (
        <FlexBetweenBox>
          <FlexBetweenBox className="social-link-wrapper">
            <SocialLogos name={link.name} />
            <Link to={link.link} target="_blank">
              {link.name}
            </Link>
          </FlexBetweenBox>

          {loadingStatus === "loading" ? (
            <CircularProgress size={18} />
          ) : (
            <FlexBetweenBox>
              <IconButton onClick={onEditLink}>
                <Edit sx={{ "&:hover": { color: palette.primary.main } }} />
              </IconButton>
              <IconButton>
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
            <IconButton>
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
