import { React, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik, Form, useField } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchForLogin } from "./../store";
import Dropzone from "react-dropzone";
import FlexBetweenBox from "./FlexBetweenBox";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(3).required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(3).required("required"),
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

const initialValuesLogin = {
  email: "",
  password: "",
};

const RegisterForm = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

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
    onSubmitProps.resetForm();

    if (savedUser) setPageType("login");
  };

  const login = async (values, onSubmitProps) => {
    // const userLoginRequest = await fetch("http://localhost:3001/auth/login", {
    //   method: "GET",
    //   body: formData,
    // });
    // const userLoginResponse = await userLoginRequest.json();
    onSubmitProps.resetForm();
    dispatch(fetchForLogin(JSON.stringify(values)));
    if (user !== null && token !== null) {
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
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
                  label="Email"
                  name="email"
                  id="email"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextInput
                  label="Password"
                  name="password"
                  id="password"
                  type="password"
                  sx={{ gridColumn: "span 2" }}
                />
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
                  label="Email"
                  name="email"
                  id="email"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextInput
                  label="Password"
                  name="password"
                  id="password"
                  type="password"
                  sx={{ gridColumn: "span 2" }}
                />
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

const TextInput = ({ ...props }) => {
  const [field, meta] = useField(props);
  return (
    <TextField
      {...field}
      {...props}
      label={props.label}
      error={Boolean(meta.touched) && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default RegisterForm;
