// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: "#311b92",
            },
            background: {
              default: "#000051",
              alt: "#000063",
            },
            text: {
              primary: "#F7E6FF",
              secondary: "#E6E6FF",
              disabled: "#04001A",
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
            },
            text: {
              primary: "#11001A",
              secondary: "#19004D",
              disabled: "#41354A",
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
