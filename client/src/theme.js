// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              light: "#4C3575",
              main: "#cbebe0",
            },
            background: {
              default: "#03001C",
              alt: "#150c2c",
              light: "#150826",
              navbar: "#06010e",
            },
            text: {
              primary: "#fff",
              secondary: "#E6E6FF",
              disabled: "#04001A",
            },
            buttons: {
              main: "#38006b",
              hover: "#540254",
              loginBtn: "#4a148c",
              loginBtnHover: "#2e0c57",
              text: "#cbebe0",
            },
            skeleton: {
              background: "#221646",
              foreground: "#392c61",
            },
            boxShadow: {
              default: "#4a078098",
            },
            logos: {
              primary: "#595364",
            },
            modal: {
              bg: "#1f123f",
            },
          }
        : {
            // palette values for light mode
            primary: {
              light: "#7c43bd",
              main: "#4a148c",
            },
            background: {
              default: "#E6FFF7",
              alt: "#e8eaf6",
              light: "#a0d8c0",
              navbar: "#d0f1e2",
            },
            text: {
              primary: "#000",
              secondary: "#19004D",
              disabled: "#41354A",
            },
            buttons: {
              main: "#12005e",
              hover: "#c8bbd9",
              loginBtn: "#7c43bd",
              loginBtnHover: "#4a148c",
              text: "#fff",
            },
            skeleton: {
              background: "#debeec",
              foreground: "#E6FFF7",
            },
            boxShadow: {
              default: "#0568458e",
            },
            logos: {
              primary: "#6a627a",
            },
            modal: {
              bg: "#e8eaf6",
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
