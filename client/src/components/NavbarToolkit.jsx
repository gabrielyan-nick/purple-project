import React from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from "@mui/material";
import {

  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
} from "@mui/icons-material";
import FlexBetweenBox from "./FlexBetweenBox";

const NavbarToolkit = ({ setMode, setLogout, fullName, direction = "row" }) => {
  const theme = useTheme();
  const background = theme.palette.background.default;
  const altBackground = theme.palette.background.alt;
  const primaryColor = theme.palette.primary.main;

  return (
    <FlexBetweenBox gap="10px" sx={{ flexDirection: direction }}>
      <FlexBetweenBox gap="10px">
        <IconButton onClick={setMode}>
          {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
          ) : (
            <LightMode sx={{ color: "#FF7E00", fontSize: "25px" }} />
          )}
        </IconButton>
        <IconButton>
          <Message sx={{ color: primaryColor, fontSize: "25px" }} />
        </IconButton>
        <IconButton>
          <Notifications sx={{ color: primaryColor, fontSize: "25px" }} />
        </IconButton>
        <IconButton>
          <Help sx={{ color: primaryColor, fontSize: "25px" }} />
        </IconButton>
      </FlexBetweenBox>

      <FormControl
        variant="standard"
        // value={fullName}
      >
        <Select
          //    value={fullName}
          sx={{
            backgroundColor: `${
              direction === "column" ? background : altBackground
            }`,
            width: "150px",
            boxShadow: `0px 0px 6px ${primaryColor}`,

            borderRadius: "5px",
            p: "5px 10px",
            "& .MuiSvgIcon-root": {
              p: "0 5px",
              width: "30px",
              color: primaryColor,
            },
            "& .MuiSelect-select:focus": {
              backgroundColor: `${
                direction === "column" ? background : altBackground
              }`,
            },
          }}
          input={<InputBase />}
        >
          <MenuItem
          //   value={fullName}
          >
            {/* <Typography>{fullName}</Typography> */}
          </MenuItem>
          <MenuItem onClick={setLogout}>Log Out</MenuItem>
        </Select>
      </FormControl>
    </FlexBetweenBox>
  );
};

export default NavbarToolkit;
