import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./styles/styles.scss";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* <Provider > */}
    <App />
    {/* </Provider> */}
  </React.StrictMode>
);
