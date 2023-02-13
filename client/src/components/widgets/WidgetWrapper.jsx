import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "15px 15px 10px 15px",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "5px",
}));

export default WidgetWrapper;
