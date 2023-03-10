import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  Button,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
} from "@mui/icons-material";
import { FlexBetweenBox, ConfirmModal, Modal } from "./index";

const NavbarToolkit = ({ setMode, setLogout, fullName, direction = "row" }) => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [logOutStatus, setLogOutStatus] = useState("idle");
  const theme = useTheme();
  const background = theme.palette.background.default;
  const altBackground = theme.palette.background.alt;
  const primaryColor = theme.palette.primary.main;

  const onLogOut = () => {
    setLogOutStatus("loading");
    setLogout();
    setLogOutStatus("idle");
  };

  const onLogOutModalClose = () => {
    setIsLogOutModalOpen(false);
  };

  const onLogOutModalOpen = () => {
    setIsLogOutModalOpen(true);
    setIsSelectOpen(false);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const onModalOpen = () => {
    setIsModalOpen(true);
  };

  const toggleSelect = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  return (
    <>
      <FlexBetweenBox gap="10px" sx={{ flexDirection: direction }}>
        <FlexBetweenBox gap="10px">
          <IconButton
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
            onClick={setMode}
          >
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: "#FF7E00", fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton
            onClick={onModalOpen}
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
          >
            <Message sx={{ color: primaryColor, fontSize: "25px" }} />
          </IconButton>
          <IconButton
            onClick={onModalOpen}
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
          >
            <Notifications sx={{ color: primaryColor, fontSize: "25px" }} />
          </IconButton>
          <IconButton
            onClick={onModalOpen}
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
          >
            <Help sx={{ color: primaryColor, fontSize: "25px" }} />
          </IconButton>
        </FlexBetweenBox>

        <FormControl variant="standard" value={fullName}>
          <Select
            open={isSelectOpen}
            onOpen={toggleSelect}
            onClose={toggleSelect}
            className={`${direction === "column" ? "mobMenu-ref-select" : ""}`}
            value={fullName}
            sx={{
              backgroundColor: `${
                direction === "column" ? background : altBackground
              }`,
              width: "180px",
              boxShadow: `0px 0px 6px ${primaryColor}`,

              borderRadius: "5px",
              p: "5px 10px",
              "& .MuiSvgIcon-root": {
                p: "0 5px",
                width: "30px",
                color: primaryColor,
                transition: "all .3s",
              },
              "& .MuiSelect-select:focus": {
                backgroundColor: `${
                  direction === "column" ? background : altBackground
                }`,
              },
            }}
            input={
              <InputBase
                className={`${direction === "column" ? "mobMenu-ref" : ""}`}
              />
            }
          >
            <MenuItem value={fullName}>
              <Typography>{fullName}</Typography>
            </MenuItem>
            <MenuItem onClick={onLogOutModalOpen}>Log Out</MenuItem>
          </Select>
        </FormControl>
      </FlexBetweenBox>

      <ConfirmModal
        opened={isLogOutModalOpen}
        closeModal={onLogOutModalClose}
        action={onLogOut}
        actionStatus={logOutStatus}
      >
        Do you really want to log out?
      </ConfirmModal>

      <Modal opened={isModalOpen} closeModal={onModalClose}>
        <Typography variant="h5" fontWeight='500'>
          This functionality is under develop
        </Typography>
      </Modal>
    </>
  );
};

export default NavbarToolkit;
