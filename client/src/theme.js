// color design tokens export
// export const colorTokens = {
//   grey: {
//     0: "#FFFFFF",
//     10: "#F6F6F6",
//     50: "#F0F0F0",
//     100: "#E0E0E0",
//     200: "#C2C2C2",
//     300: "#A3A3A3",
//     400: "#858585",
//     500: "#666666",
//     600: "#4D4D4D",
//     700: "#333333",
//     800: "#1A1A1A",
//     900: "#0A0A0A",
//     1000: "#000000",
//   },
//   primary: {
//     50: "#E6FBFF",
//     100: "#CCF7FE",
//     200: "#99EEFD",
//     300: "#66E6FC",
//     400: "#33DDFB",
//     500: "#00D5FA",
//     600: "#00A0BC",
//     700: "#006B7D",
//     800: "#00353F",
//     900: "#001519",
//   },
// };

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
            // neutral: {
            //   dark: colorTokens.grey[100],
            //   main: colorTokens.grey[200],
            //   mediumMain: colorTokens.grey[300],
            //   medium: colorTokens.grey[400],
            //   light: colorTokens.grey[700],
            // },
            background: {
              default: "#000051",
              alt: "#000063",
            },
          }
        : {
            // palette values for light mode
            primary: {
              light: "#7c43bd",
              main: "#4a148c",
            },
            // neutral: {
            //   dark: colorTokens.grey[700],
            //   main: colorTokens.grey[500],
            //   mediumMain: colorTokens.grey[400],
            //   medium: colorTokens.grey[300],
            //   light: colorTokens.grey[50],
            // },
            background: {
              default: "#ede7f6",
              alt: "#e8eaf6",
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
