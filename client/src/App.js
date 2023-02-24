import { React, useMemo, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import HomePage from "pages/homePage";
import LoginPage from "pages/loginPage";
import ProfilePage from "pages/profilePage";

const App = () => {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = !!useSelector((state) => state.auth.token);
  // const [isVerticalScroll, setIsVerticalScroll] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const hasScroll = document.body.scrollHeight > document.body.clientHeight;
  //     setIsVerticalScroll(hasScroll);
  //   };
  //   handleScroll();

  //   window.addEventListener("resize", handleScroll);
  //   return () => {
  //     window.removeEventListener("resize", handleScroll);
  //   };

   
  // }, []);

  // useEffect(() => {
  //   const el = document.querySelector(".css-x46m4d");
  //   console.log(el)
  //   if (setIsVerticalScroll) {
  //     el.style.paddingRight = "70px";
  //   } else {
  //     el.style.paddingRight = "50px";
  //   }
  // }, [setIsVerticalScroll]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/"
              element={!isAuth ? <LoginPage /> : <Navigate to={"/home"} />}
            />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to={"/"} />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
