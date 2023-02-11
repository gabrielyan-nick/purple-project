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
import { Formik, Form, useField } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "./../store";
import Dropzone from "react-dropzone";
import FlexBetweenBox from "./FlexBetweenBox";

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

// const initialValuesLogin = {
//   email: "",
//   password: "",
// };

const RegisterForm = () => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  useEffect(() => localStorage.removeItem(loginError), []);

  const onToggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const onDisableLoginError = () => {
    setUserExist(false);
    setLoginError(false);
  };

  const register = async (values, onSubmitProps) => {
    console.log(values);
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

  return (
    <Formik
      initialValues={initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
      onSubmit={handleFormSubmit}
    >
      {({ values, setFieldValue, resetForm }) => (
        <Form>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
            }}
          >
            {isRegister ? (
              <>
                <TextInput
                  label="First name"
                  name="firstName"
                  id="firstName"
                  sx={{ gridColumn: "span 1" }}
                />
                <TextInput
                  label="Last name"
                  name="lastName"
                  id="lastName"
                  sx={{ gridColumn: "span 1" }}
                />
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
                    // label="Password"
                    // name="password"
                    // id="password"
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
                <Box
                  gridColumn="span 2"
                  sx={{
                    boxShadow: `0px 0px 6px ${palette.primary.main}`,
                    borderRadius: "10px",
                  }}
                  p={1}
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        p={1}
                        sx={{
                          "&:hover": { cursor: "pointer" },
                          border: `1px dashed ${palette.primary.main}`,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <input {...getInputProps()} />

                        {!values.picture ? (
                          <p>Add picture here</p>
                        ) : (
                          <FlexBetweenBox>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetweenBox>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
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
