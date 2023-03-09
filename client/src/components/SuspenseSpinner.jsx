import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material";

const SuspenseSpinner = () => {
  const {palette} = useTheme()
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={50} color={palette.primary.main}/>
    </Box>
  );
};

export default SuspenseSpinner;
