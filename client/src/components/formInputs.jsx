import {
  TextField,
  IconButton,
  Input,
  InputLabel,
  InputBase,
  Box,
  FormHelperText,
} from "@mui/material";
import { useField, ErrorMessage, Field } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export const LoginMailInput = ({ loginError, userExist, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        {...field}
        {...props}
        label={props.label}
        error={
          (Boolean(meta.touched) && Boolean(meta.error)) ||
          userExist ||
          loginError === "User does not exist"
        }
        fullWidth
      />
      {meta.touched && (
        <FormHelperText
          sx={{
            position: "absolute",
            bottom: "-16px",
            left: "5px",
            fontSize: "11px",
            color: "#d32f2f",
          }}
        >
          {!userExist && !loginError
            ? meta.error
            : meta.touched && userExist
            ? "User with this email already exist"
            : meta.touched && loginError === "User does not exist"
            ? "User does not exist"
            : null}
        </FormHelperText>
      )}
    </Box>
  );
};

export const PasswordInput = ({
  loginError,
  showPassword,
  toggleShowPassword,
  setLoginError,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const handleInputChange = (event) => {
    helpers.setValue(event.target.value);
    setLoginError && setLoginError(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Field name={props.name}>
        {({ field }) => (
          <TextField
            {...field}
            error={
              (meta.touched && Boolean(meta.error)) ||
              loginError === "Invalid credentials"
            }
            type={`${showPassword ? "text" : "password"}`}
            label={props.label}
            fullWidth
            onChange={handleInputChange}
          />
        )}
      </Field>
      <IconButton
        onClick={toggleShowPassword}
        sx={{ position: "absolute", right: "5px", top: "22%" }}
        size="small"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
      <ErrorMessage name={props.name}>
        {(msg) => (
          <p
            style={{
              color: "red",
              position: "absolute",
              bottom: "-27px",
              left: "5px",
              fontSize: "11px",
              color: "#d32f2f",
            }}
          >
            {msg}
          </p>
        )}
      </ErrorMessage>
      {loginError === "Invalid credentials" && (
        <p
          style={{
            color: "#d32f2f",
            position: "absolute",
            fontSize: "11px",
            bottom: "-28px",
            left: "10px",
          }}
        >
          Invalid password
        </p>
      )}
    </div>
  );
};

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        label={label}
        {...field}
        {...props}
        error={meta.touched && Boolean(meta.error)}
        fullWidth
      />
      {meta.touched && meta.error ? (
        <FormHelperText
          sx={{
            position: "absolute",
            bottom: "-18px",
            left: "5px",
            fontSize: "11px",
          }}
          error
        >
          {meta.error}
        </FormHelperText>
      ) : null}
    </Box>
  );
};
