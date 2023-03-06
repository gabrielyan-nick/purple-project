import React, { useEffect, useState, useRef } from "react";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  Save,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  IconButton,
  InputBase,
} from "@mui/material";
import { FlexBetweenBox } from "components";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store";
import { setListFix } from "components/FriendListWidget/friendListWidgetSlice";
import { setUserFix } from "./userWidgetSlice";

const UserWidgetInput = ({ userId, displayedInfo, initText, typeOfData }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);
  const isMyUserWidget = loggedInUser._id === userId;
  const [editedText, setEditedText] = useState(initText);
  const [isDataEdited, setIsDataEdited] = useState(false);
  const [updateLoadingStatus, setUpdateLoadingStatus] = useState("idle");
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    focusInputs(inputRef);
  }, [isDataEdited]);

  const onEditData = () => {
    setIsDataEdited(true);
  };

  const onSaveEditedData = () => {
    const formData = new FormData();
    formData.append(`${typeOfData}`, editedText);
    setUpdateLoadingStatus("loading");
    dispatch(
      updateUserData({
        id: loggedInUser._id,
        formData,
        token,
        initData: loggedInUser,
      })
    )
      .then(() => setUpdateLoadingStatus("idle"))
      .catch(() => setUpdateLoadingStatus("error"));
    setIsDataEdited(false);
    dispatch(setUserFix());
    dispatch(setListFix());
  };

  const focusInputs = (ref) => {
    if (ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        ref.current.value.length,
        ref.current.value.length
      );
    }
  };

  return (
    <FlexBetweenBox gap="10px" mb="5px">
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        sx={{ width: "90%", height: "28px" }}
      >
        {typeOfData === "location" ? (
          <LocationOnOutlined
            fontSize="large"
            sx={{ color: palette.primary.main }}
          />
        ) : (
          <WorkOutlineOutlined
            fontSize="large"
            sx={{ color: palette.primary.main }}
          />
        )}

        {isMyUserWidget && isDataEdited ? (
          <InputBase
            inputRef={inputRef}
            onChange={(e) => setEditedText(e.target.value)}
            value={editedText}
            sx={{
              width: "100%",
              backgroundColor: "transparent",
              paddingLeft: "10px",
              borderRadius: "15px",
              boxShadow: `0px 0px 6px ${palette.primary.main}`,
            }}
          />
        ) : (
          <Typography>{displayedInfo}</Typography>
        )}
      </Box>
      {updateLoadingStatus === "loading" ? (
        <CircularProgress size={18} />
      ) : isMyUserWidget && !isDataEdited ? (
        <IconButton onClick={onEditData} sx={{ padding: "3px" }}>
          <Edit sx={{ "&:hover": { color: palette.primary.main } }} />
        </IconButton>
      ) : isMyUserWidget && isDataEdited ? (
        <IconButton onClick={onSaveEditedData} sx={{ padding: "3px" }}>
          <Save sx={{ "&:hover": { color: palette.primary.main } }} />
        </IconButton>
      ) : null}
    </FlexBetweenBox>
  );
};

export default UserWidgetInput;
