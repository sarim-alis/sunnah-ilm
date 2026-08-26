export const palettes = {
  light: {
    primary: "#596028",
    secondary: "#9BB954",
    accent: "#D7EC91",
    background: "#FFFCF5",
    card: "#FFFFFF",
    text: "#151515",
    textMuted: "#77776B",
    border: "#E6E4D4",
    error: "#B42318",
    onPrimary: "#FFFFFF",
  },
  dark: {
    primary: "#9BB954",
    secondary: "#C5DD7A",
    accent: "#2A3018",
    background: "#14160F",
    card: "#1E2116",
    text: "#F5F2E8",
    textMuted: "#9A9A88",
    border: "#323628",
    error: "#E25A4E",
    onPrimary: "#14160F",
  },
} as const;

export type ThemeColors = (typeof palettes)[keyof typeof palettes];
