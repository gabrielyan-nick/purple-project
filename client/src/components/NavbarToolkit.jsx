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
import { FlexBetweenBox, ModalWindow } from "./index";

const NavbarToolkit = ({ setMode, setLogout, fullName, direction = "row" }) => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const theme = useTheme();
  const background = theme.palette.background.default;
  const altBackground = theme.palette.background.alt;
  const primaryColor = theme.palette.primary.main;

  const onModalClose = () => {
    setIsLogOutModalOpen(false);
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
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
          >
            <Message sx={{ color: primaryColor, fontSize: "25px" }} />
          </IconButton>
          <IconButton
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
          >
            <Notifications sx={{ color: primaryColor, fontSize: "25px" }} />
          </IconButton>
          <IconButton
            className={`${direction === "column" ? "mobMenu-ref" : ""}`}
          >
            <Help sx={{ color: primaryColor, fontSize: "25px" }} />
          </IconButton>
        </FlexBetweenBox>

        <FormControl variant="standard" value={fullName}>
          <Select
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
            <MenuItem onClick={() => setIsLogOutModalOpen(true)}>
              Log Out
            </MenuItem>
          </Select>
        </FormControl>
      </FlexBetweenBox>

      <ModalWindow opened={isLogOutModalOpen} closeModal={onModalClose}>
        <Box>
          <Typography variant="h5">Do you really want to log out?</Typography>
          <FlexBetweenBox mt="15px">
            <Button
              style={{
                backgroundColor: "#034934",
                color: "#fff",
                width: "30%",
              }}
              variant="contained"
              onClick={setLogout}
            >
              Yes
            </Button>
            <Button
              style={{
                backgroundColor: "#49032e",
                color: "#fff",
                width: "30%",
              }}
              variant="contained"
              onClick={onModalClose}
            >
              No
            </Button>
          </FlexBetweenBox>
        </Box>
      </ModalWindow>
    </>
  );
};

export default NavbarToolkit;
