export const theme = {
  colors: {
    primary: "#46A758",
    background: "#F5FBF5",
    card: "#F4FBF6",
    text: "#1C2024",
    textSecondary: "#60646C",
    border: "hsl(240, 10%, 87%)",
    error: "#CE2C31",
    navbarBackground: "#F5FBF5",
    grass3: "#E9F6E9",
    gray: "#F9F9FB",
    gray2: "#B9BBC6",
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  typography: {
    sizes: {
      small: 12,
      regular: 16,
      large: 20,
      title: 24,
      header: 28,
    },
    weights: {
      regular: "400" as const,
      medium: "500" as const,
      bold: "700" as const,
    },
  },
};
