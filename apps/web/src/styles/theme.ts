export const theme = {
  colors: {
    background: "#121212",
    surface: "#1E1E1E",
    primary: "#9A68FC",
    text: "#FFFFFF",
    textSecondary: "#AAAAAA",
    error: "#FF6B6B",
    cancel: "#FF4B4B",
    cancelDark: "#a11f1f",
    input: "#1E1E1E",
    border: "#ddd",
    primaryDark: "#5b21b6", // roxo escuro
    gray: "#e0e0e0",
    grayLight: "#f0f0f0",
    danger: "#e74c3c",
    dangerDark: "#c0392b",
    alert: "#EC942C",
  },

  spacing: {
    sm: "8px",
    md: "16px",
    lg: "32px",
  },

  borderRadius: "8px",
};

export type ThemeType = typeof theme;
