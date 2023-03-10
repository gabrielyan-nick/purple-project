import { ErrorMessage } from "../../components/index";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const ErrorPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: "50px",
        gap: "20px",
      }}
    >
      <ErrorMessage />
      <Typography variant="h4">Page doesn't exist</Typography>
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <Typography variant="h4">Go back</Typography>
      </Link>
    </Box>
  );
};

export default ErrorPage;
