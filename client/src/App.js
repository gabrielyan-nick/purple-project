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
const ErrorPage = lazy(() => import("./pages/errorPage"));
const ForgotPasswordPage = lazy(() => import("./pages/forgotPasswordPage"));

const App = () => {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = !!useSelector((state) => state.auth.token);

  return (
    <div className="app">
      <BrowserRouter basename="https://purple-jttl.onrender.com">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
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
                  path="/reset-password/:resetToken"
                  element={<ResetPasswordPage />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path={"*"} element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </main>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
