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
import { useDispatch } from "react-redux";
import { setLogin } from "store";
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
  const { pallete } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const handleFormSubmit = async (values, onSubmitProps) => {};

  return (
    <Formik
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
          }}
        >
          {isRegister && (
            <>
              <TextInput
                label="First name"
                name="firstName"
                id="firstName"
                sx={{ gridColumn: "span 1" }}
              />
              <TextInput
                label="Lirst name"
                name="lastName"
                id="lastName"
                sx={{ gridColumn: "span 1" }}
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
            </>
          )}
        </Box>
      </Form>
    </Formik>
  );
};

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        {...field}
        {...props}
        error={Boolean(meta.touched) && Boolean(meta.errors)}
        helperText={meta.touched && meta.errors}
      />
    </>
  );
};

export default RegisterForm;

{
  /* <TextField
label="First name"
onBlur={handleBlur}
onChange={handleChange}
value={values.firstName}
name="firstName"
error={
  Boolean(touched.firstName) && Boolean(errors.firstName)
}
helperText={touched.firstName && errors.firstName}
sx={{ gridColumn: "span 1" }}
/> */
}
