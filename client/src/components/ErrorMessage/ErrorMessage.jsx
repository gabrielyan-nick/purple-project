import React from "react";
import error from "./error.png";

const ErrorMessage = () => {
  return (
    <img
      src={error}
      alt="error"
      style={{
        maxWidth: "200px",
        maxHeight: "200px",
        margin: "0 auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  );
};

export default ErrorMessage;
