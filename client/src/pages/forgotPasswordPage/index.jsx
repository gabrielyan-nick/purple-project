import React from "react";
import { Box, useTheme, useMediaQuery, IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  LightLogo,
  DarkLogo,
  ErrorBoundary,
  ForgotPassword,
} from "../../components";
import { setMode } from "../../store/index";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallScreens = useMediaQuery("(max-width: 600px)");
  const mode = useSelector((state) => state.auth.mode);
  const { palette } = useTheme();

  const onSetMode = () => {
    dispatch(setMode());
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          p: "10px 50px",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          my: 1,
        }}
      >
        {mode === "light" ? <LightLogo /> : <DarkLogo />}
        <IconButton onClick={onSetMode} sx={{ height: "40px" }}>
          {mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
          ) : (
            <LightMode sx={{ color: "#FF7E00", fontSize: "25px" }} />
          )}
        </IconButton>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : isSmallScreens ? "95%" : "85%"}
        maxWidth="500px"
        mx="auto"
        borderRadius="15px"
        backgroundColor={palette.background.alt}
      >
        <ErrorBoundary>
          <ForgotPassword />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
