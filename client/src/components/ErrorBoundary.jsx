import React, { Component } from "react";
import { ErrorMessage, WidgetWrapper } from "./index";
import { Typography, useTheme } from "@mui/material";

class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ error: true });
  }

  render() {
    if (this.state.error) {
      return (
        <WidgetWrapper
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <ErrorMessage />
          <Typography variant="body1" sx={{ mt: "20px" }}>
            Something went wrong... Please, reload page or try again later.
          </Typography>
        </WidgetWrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
