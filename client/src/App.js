import { React, useMemo, Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { SuspenseSpinner } from "components";
import { themeSettings } from "theme";

const HomePage = lazy(() => import("./pages/homePage"));
const LoginPage = lazy(() => import("./pages/loginPage"));
const ProfilePage = lazy(() => import("./pages/profilePage"));
const ResetPasswordPage = lazy(() => import("./pages/resetPasswordPage"));

const App = () => {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = !!useSelector((state) => state.auth.token);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<SuspenseSpinner />}>
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
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
