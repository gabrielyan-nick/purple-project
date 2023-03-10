import React, { useState } from "react";
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
  LoginForm,
  ErrorBoundary,
  ForgotPassword,
} from "../../components";
import { setMode } from "../../store/index";

const LoginPage = () => {
  const [formType, setFormType] = useState("login");
  const mode = useSelector((state) => state.auth.mode);
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallScreens = useMediaQuery("(max-width: 600px)");
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
        p={2}
        mx="auto"
        mb="20px"
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
        {formType === "login" ? (
          <LoginForm setFormType={setFormType} />
        ) : (
          <RegisterForm setFormType={setFormType} />
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
