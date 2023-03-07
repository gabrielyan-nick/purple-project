import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { storage } from "../firebase";
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
import { FlexBetweenBox, PhotoModal, ForgotPassword } from "./index";

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

const RegisterForm = ({ setForgotPass }) => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [avatar, setAvatar] = useState(null);
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
    const imageRef = ref(storage, `avatars/${avatar.name}`);
    uploadBytes(imageRef, avatar)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            if (!avatar) {
              console.log("Avatar file is missing or not yet uploaded");
              return;
            }
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              if (key !== "picture") {
                formData.append(key, values[key]);
              }
            });
            formData.append("picturePath", url);

            fetch("http://localhost:3001/auth/register", {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((res) => {
                if (res === "User already exist") setUserExist(true);
                if (res.error) setRegisterError(true);
                if (res && res !== "User already exist" && !res.error) {
                  onSubmitProps.resetForm();
                  setRegisterError(false);
                  setPageType("login");
                }
              })
              .catch((error) => {
                setRegisterError(true);
              });
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
            setRegisterError(true);
          });
      })
      .catch((error) => {
        console.log(error.message);
        setRegisterError(true);
      });
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
    setAvatar(file);
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
        {({ values, errors, touched, setFieldValue, resetForm }) => (
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
                          {errors.picture && touched.picture ? (
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
                        onChange={onSetAvatar}
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
                    <Box display="flex" justifyContent="flex-end">
                      <Typography
                        onClick={() => setForgotPass(true)}
                        sx={{
                          textDecoration: "underline",
                          marginLeft: "auto",
                          cursor: "pointer",
                          "&:hover": {
                            color: palette.primary.main,
                          },
                        }}
                      >
                        Forgot password
                      </Typography>
                    </Box>
                  </div>
                </>
              )}
            </Box>
            <Box
              sx={{ position: "relative" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {registerError && (
                <Typography
                  color="#d32f2f"
                  sx={{
                    position: "absolute",
                    top: "4px",
                    left: "20%",
                    width: "70%",
                  }}
                >
                  Oops...something went wrong. Try once more
                </Typography>
              )}
              <Button
                fullWidth
                type="submit"
                sx={{
                  mt: "20px",
                  backgroundColor: palette.buttons.loginBtn,
                  color: palette.buttons.text,
                  "&:hover": {
                    backgroundColor: palette.buttons.loginBtnHover,
                  },
                }}
              >
                {isRegister ? "Register" : "Login"}
              </Button>
              <Button
                sx={{
                  width: `${!isNonMobile ? "100%" : "62%"}`,
                  mt: "10px",
                  backgroundColor: palette.buttons.loginBtn,
                  color: palette.buttons.text,
                  "&:hover": {
                    backgroundColor: palette.buttons.loginBtnHover,
                  },
                }}
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                  setRegisterError(false);
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign up here"
                  : "Already have an account? Login here"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <PhotoModal
        image={avatarUrl}
        alt={"avatar"}
        opened={isPhotoModalOpen}
        closeModal={closePhotoModal}
        isInRegForm
      />
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
        sx={{ position: "absolute", right: "5px", top: "17%" }}
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
