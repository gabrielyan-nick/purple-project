import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Container,
  Typography,
  useTheme,
  IconButton,
  CircularProgress,
  Fade,
} from "@mui/material";
import { WidgetWrapper, FlexBetweenBox } from "./index";
import { serverUrl } from "config";

const ResetPassword = ({ resetToken }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("idle");
  const { palette } = useTheme();
  const navigate = useNavigate();

  const onChangePassword = (event) => {
    setConfirmError(false);
    setPassword(event.target.value);
  };

  const onChangeConfirmPassword = (event) => {
    setConfirmError(false);
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError(true);
      return;
    } else {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("token", resetToken);

      setLoadingStatus("loading");
      fetch(`${serverUrl}/auth/reset-password`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          setMessage(res.message);
          if (res.message === "Password changed successfully") {
            setTimeout(() => navigate("/"), 5000);
          }
        })
        .catch((error) => {
          console.log(error);
          setMessage("Error");
        })
        .finally(() => {
          setLoadingStatus("idle");
          setPassword("");
          setConfirmPassword("");
        });
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
        Enter a new password
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          position: "relative",
        }}
      >
        <TextField
          size="small"
          label="New password"
          type="password"
          value={password}
          onChange={onChangePassword}
          inputProps={{ minLength: 3 }}
          required
        />
        <TextField
          size="small"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          inputProps={{ minLength: 3 }}
          required
        />
        <Fade in={confirmError} timeout={300}>
          <Typography
            ml="10px"
            variant="subtitle1"
            color="#c21a52"
            sx={{ position: "absolute", bottom: "37px", left: 0 }}
          >
            Password mismatch
          </Typography>
        </Fade>
        {loadingStatus === "loading" ? (
          <CircularProgress size={20} />
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
              marginTop: "15px",
            }}
          >
            Save changes
          </Button>
        )}
      </form>
      <Fade in={!!message}>
        <Typography mt="7px" variant="subtitle1">
          {`${message}. You will be redirected to the login page.`}
        </Typography>
      </Fade>
    </WidgetWrapper>
  );
};

export default ResetPassword;
