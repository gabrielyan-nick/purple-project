import { React, useState, useRef } from "react";
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
import { CSSTransition } from "react-transition-group";
import { setMode, setLogout } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { FlexBetweenBox, Logo } from "components";
import useOnClickOutside from "hooks/useOnClickOutside";
import NavbarToolkit from "components/NavbarToolkit";
import "../navbar/styles.scss";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const menuRef = useRef(null);

  const theme = useTheme();
  const background = theme.palette.background.default;
  const altBackground = theme.palette.background.alt;
  const primaryColor = theme.palette.primary.main;
  const primaryLightColor = theme.palette.primary.light;
  // const fullName = `${user.firstName} ${user.lastName}`;

  useOnClickOutside(menuRef, () => setIsMobileMenuOpen(false));

  const onSetMode = () => {
    dispatch(setMode());
  };

  const onLogOut = () => {
    dispatch(setLogout());
  };

  return (
    <FlexBetweenBox padding="10px 50px">
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
            <InputBase
              placeholder="Search..."
              sx={{
                padding: "0 10px",
              }}
            />
            <IconButton
              sx={{
                backgroundColor: background,
                padding: 0,
                width: "30px",
                height: "29px",
                borderRadius: 0,
                "&:hover": {
                  backgroundColor: altBackground,
                },
                transition: "all .3s",
              }}
            >
              <Search />
            </IconButton>
          </FlexBetweenBox>
        )}
      </FlexBetweenBox>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <NavbarToolkit
          setMode={onSetMode}
          setLogout={onLogOut}
          // fullName={fullName}
        />
      ) : (
        <IconButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu sx={{ fontSize: "30px" }} />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      <CSSTransition
        timeout={0}
        nodeRef={menuRef}
        classNames="mobile-menu"
        in={isMobileMenuOpen}
      >
        <Box
          className="mobile-menu"
          ref={menuRef}
          sx={{
            background: altBackground,
            p: '0 10px'
          }}
        >
          <Box display="flex" justifyContent="flex-end" p="5px">
            <IconButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Close sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
          <NavbarToolkit
            setMode={onSetMode}
            setLogout={onLogOut}
            direction={"column"}
            // fullName={fullName}

          />
        </Box>
      </CSSTransition>
    </FlexBetweenBox>
  );
};

export default Navbar;
