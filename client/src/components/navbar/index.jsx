import { React, useState, useRef, useEffect,  } from "react";
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
import { Search, Menu, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { setMode, setLogout } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { FlexBetweenBox, LightLogo, DarkLogo } from "components";
import useOnClickOutside from "hooks/useOnClickOutside";
import NavbarToolkit from "components/NavbarToolkit";
import "./styles.scss";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, mode } = useSelector((state) => state.auth);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const menuRef = useRef(null);
  const { palette } = useTheme();
  const background = palette.background.default;
  const altBackground = palette.background.alt;
  const primaryColor = palette.primary.main;
  const fullName = `${user.firstName} ${user.lastName}`;

  useEffect(() => {
    !isMobileMenuOpen ? changeBtnsTabIndex("-1") : changeBtnsTabIndex("0");
  }, [isMobileMenuOpen]);

  const changeBtnsTabIndex = (i) => {
    document
      .querySelectorAll(".mobMenu-ref")
      .forEach((ref) => ref.setAttribute("tabindex", i));
    const selectRef = document.querySelector(".mobMenu-ref-select");
    selectRef.querySelector("div").setAttribute("tabindex", i);
  };

  useOnClickOutside(menuRef, () => setIsMobileMenuOpen(false));

  const onSetMode = () => {
    dispatch(setMode());
  };

  const onLogOut = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <FlexBetweenBox
      padding="10px 50px"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: palette.background.navbar,
        boxShadow: `0 0 6px 0 ${palette.boxShadow.default}`,
      }}
    >
      <FlexBetweenBox gap="50px">
        {mode === "light" ? (
          <LightLogo navigate={() => navigate("/home")} pointer="pointer" />
        ) : (
          <DarkLogo navigate={() => navigate("/home")} pointer="pointer" />
        )}

        {isNonMobileScreens && (
          <FlexBetweenBox
            sx={{
              borderRadius: "15px",
              boxShadow: `0px 0px 6px ${primaryColor}`,
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
          fullName={fullName}
        />
      ) : (
        <IconButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu sx={{ fontSize: "30px", color: primaryColor }} />
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
          className={`mobile-menu${
            isMobileMenuOpen ? " mobile-menu-enter-done" : ""
          }`}
          ref={menuRef}
          sx={{
            background: palette.background.light,
            p: "0 10px",
          }}
        >
          <Box display="flex" justifyContent="flex-end" p="5px">
            <IconButton
              className="mobMenu-ref"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Close sx={{ fontSize: "30px", color: primaryColor }} />
            </IconButton>
          </Box>
          <NavbarToolkit
            setMode={onSetMode}
            setLogout={onLogOut}
            direction={"column"}
            fullName={fullName}
          />
        </Box>
      </CSSTransition>
    </FlexBetweenBox>
  );
};

export default Navbar;
