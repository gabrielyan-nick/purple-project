import React from "react";
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
  RegisterForm,
  ErrorBoundary,
} from "../../components";
import { setMode } from "../../store/index";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallScreens = useMediaQuery("(max-width: 600px)");
  const mode = useSelector((state) => state.auth.mode);

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
        p={2}
        mx="auto"
        borderRadius="15px"
        backgroundColor={palette.background.alt}
      >
        <Typography
          color={palette.primary.main}
          fontWeight="500"
          variant="h4"
          sx={{ mb: 2 }}
        >
          {`Welcome to Purple${
            !isSmallScreens ? ", social network for everyone" : ""
          }`}
        </Typography>
        <ErrorBoundary>
          <RegisterForm />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default LoginPage;
