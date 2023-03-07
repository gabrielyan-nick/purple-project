import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  LightLogo,
  DarkLogo,
  ErrorBoundary,
  ResetPassword,
} from "../../components";
import { setMode } from "../../store/index";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallScreens = useMediaQuery("(max-width: 600px)");
  const mode = useSelector((state) => state.auth.mode);
  const navigate = useNavigate();
  const { token } = useParams();

  const onSetMode = () => {
    dispatch(setMode());
  };

  const navOnLoginPage = () => {
    navigate("/");
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
        {mode === "light" ? (
          <LightLogo navigate={navOnLoginPage} pointer="pointer" />
        ) : (
          <DarkLogo navigate={navOnLoginPage} pointer="pointer" />
        )}
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
        <ResetPassword resetToken={token} />
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
