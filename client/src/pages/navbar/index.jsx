import { React, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { FlexBetweenBox, Logo } from "components";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const background = theme.palette.background.default;
  const altBackground = theme.palette.background.alt;
  const primaryColor = theme.palette.primary.main;
  const primaryLightColor = theme.palette.primary.light;

  // const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <FlexBetweenBox padding="10px 20px">
      <FlexBetweenBox gap="50px">
        <Logo onClick={() => navigate("/home")} />

        {isNonMobileScreens && (
          <FlexBetweenBox
            sx={{
              borderRadius: "15px",
              border: "2px solid #350E65",
              overflow: "hidden",
            }}
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              style={{
                border: "none",

                height: "26px",
              }}
            />
            <button
              style={{
                backgroundColor: altBackground,
              }}
            >
              <Search />
            </button>
          </FlexBetweenBox>
        )}
      </FlexBetweenBox>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetweenBox>
          <button onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
          </button>
        </FlexBetweenBox>
      ) : (
        <button></button>
      )}
    </FlexBetweenBox>
  );
};

export default Navbar;
