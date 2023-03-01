import { React, useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AddAPhoto } from "@mui/icons-material";
import { Formik, Form, useField, ErrorMessage } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "./../store";
import { FlexBetweenBox, PhotoModal } from "./index";

const registerSchema = yup.object({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(3).required("Required"),
  location: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
  picture: yup.string().required("Required"),
});

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(3).required("Required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const RegisterForm = () => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const onToggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const onDisableLoginError = () => {
    setUserExist(false);
    setLoginError(false);
  };

  const register = async (values, onSubmitProps) => {
    const formData = new FormData(); // Вручную формируем FormData, чтобы добавить изображение
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      { method: "POST", body: formData }
    );
    const savedUser = await savedUserResponse.json();

    if (savedUser === "User already exist") setUserExist(true);
    if (savedUser && savedUser !== "User already exist") {
      onSubmitProps.resetForm();
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const userLoginResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await userLoginResponse.json();

    if (loggedIn && !loggedIn.msg) {
      onSubmitProps.resetForm();
      dispatch(setLogin(loggedIn));
      navigate("/home");
    } else {
      setLoginError(loggedIn.msg);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    onDisableLoginError();
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const onSetAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
    }
  };

  const openPhotoModal = () => setIsPhotoModalOpen(true);
  const closePhotoModal = () => setIsPhotoModalOpen(false);

  return (
    <>
      <Formik
        initialValues={initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, setFieldValue, resetForm }) => (
          <Form>
            <Box
              display="grid"
              rowGap="25px"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              {isRegister ? (
                <>
                  <Box gridColumn="1">
                    <TextInput
                      label="First name"
                      name="firstName"
                      id="firstName"
                      sx={{ marginBottom: "25px", width: "100%" }}
                    />
                    <TextInput
                      label="Last name"
                      name="lastName"
                      id="lastName"
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <Box
                    gridColumn="2"
                    sx={{
                      height: "130px",
                      display: "flex",
                      justifyContent: `${isNonMobile ? "flex-end" : "center"}`,
                      alignItems: "center",
                      gap: "15px",
                      order: `${!isNonMobile ? "-1" : "0"}`,
                    }}
                  >
                    <Box
                      width="110px"
                      height="110px"
                      sx={{
                        boxShadow: `0px 0px 6px ${palette.primary.main}`,
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="user"
                          style={{
                            objectFit: "cover",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          width="120px"
                          height="120px"
                          onClick={openPhotoModal}
                        />
                      ) : (
                        <>
                          {errors.picture ? (
                            <Typography
                              variant="subtitle1"
                              sx={{ userSelect: "none", color: "#d32f2f" }}
                            >
                              Require
                            </Typography>
                          ) : (
                            <Typography
                              variant="subtitle2"
                              sx={{ userSelect: "none" }}
                            >
                              Add photo
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                    <IconButton
                      component="label"
                      htmlFor="picture"
                      sx={{ marginRight: "10px" }}
                    >
                      <AddAPhoto
                        sx={{
                          "&:hover": {
                            color: palette.primary.main,
                            cursor: "pointer",
                          },
                        }}
                      />
                      <input
                        label="picture"
                        name="picture"
                        id="picture"
                        type="file"
                        hidden
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(e) => {
                          onSetAvatar(e);
                          setFieldValue("picture", e.target.files[0]);
                        }}
                      />
                    </IconButton>
                  </Box>
                  <TextInput
                    userExist={userExist}
                    label="Email"
                    name="email"
                    id="email"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <div style={{ gridColumn: "span 2", position: "relative" }}>
                    <PasswordInput
                      showPassword={showPassword}
                      toggleShowPassword={onToggleShowPassword}
                    />
                  </div>
                  <TextInput
                    label="Location"
                    name="location"
                    id="location"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextInput
                    label="Occupation"
                    name="occupation"
                    id="occupation"
                    sx={{ gridColumn: "span 2" }}
                  />
                </>
              ) : (
                <>
                  <TextInput
                    loginError={loginError}
                    label="Email"
                    name="email"
                    id="email"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <div style={{ gridColumn: "span 2", position: "relative" }}>
                    <PasswordInput
                      showPassword={showPassword}
                      toggleShowPassword={onToggleShowPassword}
                      loginError={loginError}
                    />
                  </div>
                </>
              )}
            </Box>
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  mt: "30px",
                  backgroundColor: palette.primary.light,
                  color: palette.background.default,
                  "&:hover": {
                    backgroundColor: palette.primary.main,
                  },
                }}
              >
                {isRegister ? "Register" : "Login"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  mt: "5px",
                  color: palette.primary.main,
                  textDecoration: "underline",
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
      {isPhotoModalOpen && (
        <PhotoModal
          image={avatarUrl}
          alt={"avatar"}
          closeModal={closePhotoModal}
          isInRegForm
        />
      )}
    </>
  );
};

const TextInput = ({ loginError, userExist = false, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        {...field}
        {...props}
        label={props.label}
        error={
          (Boolean(meta.touched) && Boolean(meta.error)) ||
          userExist ||
          Boolean(loginError)
        }
        helperText={
          meta.touched && !userExist && !loginError
            ? meta.error
            : meta.touched && userExist
            ? "User with this email already exist"
            : meta.touched && loginError === "User does not exist"
            ? "User does not exist"
            : null
        }
      />
    </>
  );
};

const PasswordInput = ({ showPassword, toggleShowPassword, loginError }) => {
  return (
    <>
      <TextInput
        label="Password"
        name="password"
        id="password"
        type={`${showPassword ? "text" : "password"}`}
        sx={{ width: "100%" }}
        loginError={loginError}
      />
      <IconButton
        onClick={toggleShowPassword}
        sx={{ position: "absolute", right: "5px", top: "20%" }}
        size="small"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
      {loginError === "Invalid credentials" && (
        <p className="password-error-text">Invalid password</p>
      )}
    </>
  );
};

export default RegisterForm;
