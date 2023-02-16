import React from "react";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { LightLogo, DarkLogo, RegisterForm } from "../../components";

const LoginPage = () => {
  const theme = useTheme();
  const altBackground = theme.palette.background.alt;
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mode = useSelector((state) => state.auth.mode);

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          p: "10px 50px",
          display: "flex",
          justifyContent: "center",
          my: 1,
        }}
      >
        {mode === "light" ? <LightLogo /> : <DarkLogo />}
      </Box>
      <Box
        width={isNonMobileScreens ? "40%" : "85%"}
        p={2}
        mx="auto"
        borderRadius="15px"
        backgroundColor={altBackground}
      >
        <Typography fontWeight="500" variant="h4" sx={{ mb: 2 }}>
          Welcome to Purple
        </Typography>
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
