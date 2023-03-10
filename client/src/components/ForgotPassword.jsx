import { React, useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { WidgetWrapper, FlexBetweenBox } from "./index";
import { serverUrl } from "config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("idle");
  const { palette } = useTheme();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('')
    if (email) {
      const formData = new FormData();
      formData.append("email", email);

      setLoadingStatus("loading");
      fetch(`${serverUrl}/auth/forgot-password`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          setMessage(res.message);
          setEmail("");
        })
        .catch((error) => {
          console.log(error);
          setMessage("Error");
        })
        .finally(() => setLoadingStatus("idle"));
    }
  };

  return (
    <WidgetWrapper
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "20px",
      }}
    >
      <Typography
        color={palette.primary.main}
        fontWeight="500"
        variant="h4"
        sx={{ mb: 2 }}
      >
        Enter your email
      </Typography>
      <form onSubmit={handleSubmit}>
        <FlexBetweenBox gap="20px">
          <TextField
            size="small"
            type="email"
            id="email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
          {loadingStatus === "loading" ? (
            <Box
              sx={{
                width: "64px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={20} />
            </Box>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: palette.buttons.loginBtn,
                color: palette.buttons.text,
                "&:hover": {
                  backgroundColor: palette.buttons.loginBtnHover,
                },
              }}
            >
              Send
            </Button>
          )}
        </FlexBetweenBox>
      </form>
      <Typography mt="7px" variant="subtitle1">
        {message}
      </Typography>
    </WidgetWrapper>
  );
};

export default ForgotPassword;
