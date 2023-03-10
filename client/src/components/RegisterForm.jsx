import { React, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { PhotoModal, Modal } from "./index";
import { TextInput, PasswordInput, LoginMailInput } from "./formInputs";
import { serverUrl } from "config";

const registerSchema = yup.object({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(3).required("Required"),
  location: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
  picturePath: yup.string().required("Required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picturePath: "",
};

const RegisterForm = ({ setFormType }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [regStatus, setRegStatus] = useState("idle");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isGoToLoginModalOpen, setIsGoToLoginModalOpen] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { palette } = useTheme();

  const onChangeForm = () => {
    setFormType("login");
  };

  const onToggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    setRegStatus("loading");
    setRegisterError(false);
    const imageRef = ref(storage, `avatars/${avatar.name}`);
    uploadBytes(imageRef, avatar)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              if (key !== "picturePath") {
                formData.append(key, values[key]);
              }
            });
            formData.append("picturePath", url);

            fetch(`${serverUrl}/auth/register`, {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((res) => {
                if (res === "User already exist") setUserExist(true);
                if (res.error) {
                  setRegisterError(true);
                  setRegStatus("idle");
                }
                if (res && res !== "User already exist" && !res.error) {
                  onSubmitProps.resetForm();
                  setRegisterError(false);
                  setRegStatus("idle");
                  setIsGoToLoginModalOpen(true);
                }
              })
              .catch((error) => {
                setRegisterError(true);
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error.message);
            setRegisterError(true);
          });
      })
      .catch((error) => {
        console.log(error.message);
        setRegisterError(true);
      });
  };

  const onSetAvatar = async (e, setFieldValue) => {
    setFieldValue("picturePath", e.target.files[0].name);
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
  const closeGoToLoginModal = () => setIsGoToLoginModalOpen(false);

  return (
    <>
      <Formik
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, setFieldValue, resetForm, formik }) => (
          <Form>
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              rowGap="25px"
              mb="25px"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <Box
                gridColumn="1"
                sx={{ display: "flex", flexDirection: "column", gap: "25px" }}
              >
                <TextInput label="First name" name="firstName" id="firstName" />
                <TextInput label="Last name" name="lastName" id="lastName" />
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
                      {errors.picturePath && touched.picturePath ? (
                        <Typography
                          variant="subtitle1"
                          sx={{ userSelect: "none", color: "#d32f2f" }}
                        >
                          Require
                        </Typography>
                      ) : (
                        <Typography
                          color={palette.primary.main}
                          variant="subtitle1"
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
                  htmlFor="picturePath"
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
                    label="picturePath"
                    name="picturePath"
                    id="picturePath"
                    type="file"
                    hidden
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => onSetAvatar(e, setFieldValue)}
                  />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                position: "relative",
              }}
            >
              <LoginMailInput
                label="Email"
                name="email"
                id="email"
                userExist={userExist}
                loginError={registerError}
              />
              <div style={{ gridColumn: "span 2", position: "relative" }}>
                <PasswordInput
                  name="password"
                  label="Password"
                  id="password"
                  showPassword={showPassword}
                  toggleShowPassword={onToggleShowPassword}
                />
              </div>
              <TextInput label="Location" name="location" id="location" />
              <TextInput label="Occupation" name="occupation" id="occupation" />
              {registerError && (
                <Typography
                  color="#d32f2f"
                  sx={{
                    position: "absolute",
                    bottom: "-25px",
                    left: "20%",
                    width: "70%",
                  }}
                >
                  Oops...something went wrong. Try again later
                </Typography>
              )}
            </Box>

            <Box
              sx={{ position: "relative" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="35px"
            >
              {regStatus === "loading" && !userExist ? (
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
                  Register
                </Button>
              )}
              <Button
                sx={{
                  width: "62%",
                  mt: "15px",
                  backgroundColor: palette.buttons.loginBtn,
                  color: palette.buttons.text,
                  "&:hover": {
                    backgroundColor: palette.buttons.loginBtnHover,
                  },
                }}
                disabled={regStatus === "loading" && !userExist}
                onClick={() => {
                  onChangeForm();
                  resetForm();
                }}
              >
                {isNonMobile ? "Already have an account? Login here" : "Login"}
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

      <Modal
        opened={isGoToLoginModalOpen}
        closeModal={closeGoToLoginModal}
        action={onChangeForm}
      >
        <Typography variant="h5" fontWeight="500">
          Thank you for registering. Now you can log in using your credentials.
        </Typography>
      </Modal>
    </>
  );
};

export default RegisterForm;
