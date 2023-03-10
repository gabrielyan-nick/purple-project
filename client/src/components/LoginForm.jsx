import { React, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";

import { Formik, Form } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "./../store";
import { LoginMailInput, PasswordInput } from "./formInputs";
import { serverUrl } from "config";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(3).required("Required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginForm = ({ setFormType }) => {
  const [loginStatus, setLoginStatus] = useState("idle");
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { palette } = useTheme();

  const onChangeForm = () => {
    setFormType("register");
  };

  const onToggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const disableForgotPassLink = (e) => {
    if (loginStatus === "loading") {
      e.preventDefault();
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    setLoginStatus("loading");
    setLoginError(false);
    const userLoginResponse = await fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await userLoginResponse.json();
    setLoginStatus("idle");
    if (loggedIn && !loggedIn.msg) {
      onSubmitProps.resetForm();

      dispatch(setLogin(loggedIn)).then(() => {
        navigate("/home");
      });
    } else {
      setLoginError(loggedIn.msg);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValuesLogin}
        validationSchema={loginSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              <LoginMailInput
                loginError={loginError}
                label="Email"
                name="email"
                id="email"
              />
              <div style={{ position: "relative" }}>
                <PasswordInput
                  name="password"
                  label="Password"
                  id="password"
                  showPassword={showPassword}
                  toggleShowPassword={onToggleShowPassword}
                  loginError={loginError}
                  setLoginError={setLoginError}
                />
              </div>
            </Box>

            <Box display="flex" justifyContent="flex-end" m="5px 0 25px">
              <Link
                to={"/forgot-password"}
                onClick={disableForgotPassLink}
                style={{ color: palette.primary.main }}
              >
                Forgot password
              </Link>
            </Box>

            <Box
              sx={{ position: "relative" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {loginStatus === "loading" ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size={33} />
                </Box>
              ) : (
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    backgroundColor: palette.buttons.loginBtn,
                    color: palette.buttons.text,
                    "&:hover": {
                      backgroundColor: palette.buttons.loginBtnHover,
                    },
                  }}
                >
                  Login
                </Button>
              )}
              <Button
                sx={{
                  width: "62%",
                  mt: "10px",
                  backgroundColor: palette.buttons.loginBtn,
                  color: palette.buttons.text,
                  "&:hover": {
                    backgroundColor: palette.buttons.loginBtnHover,
                  },
                }}
                disabled={loginStatus === "loading"}
                onClick={() => {
                  onChangeForm();
                  resetForm();
                }}
              >
                {isNonMobile
                  ? " Don't have an account? Sign up here"
                  : "Sign up"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
