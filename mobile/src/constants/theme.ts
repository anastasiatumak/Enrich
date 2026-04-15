import { useSettingsStore } from "../store/useSettingsStore";
import { useColorScheme } from "react-native";

export const lightColors = {
  primary: "#46A758",
  background: "#F5FBF5",
  card: "#FFFFFF",
  text: "#1C2024",
  textSecondary: "#60646C",
  border: "hsl(240, 10%, 87%)",
  error: "#CE2C31",
  navbarBackground: "#F5FBF5",
  grass3: "#E9F6E9",
  gray: "#F9F9FB",
  gray2: "#B9BBC6",
};

export const darkColors = {
  primary: "#46A758", // Keep branding color
  background: "#111111",
  card: "#1C1C1C",
  text: "#EEEEEE",
  textSecondary: "#A0A0A0",
  border: "#333333",
  error: "#FF4D4D",
  navbarBackground: "#111111",
  grass3: "#1A2E1A",
  gray: "#222222",
  gray2: "#444444",
};

export const themeBase = {
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

// Hook to get the current colors based on theme setting
export const useAppTheme = () => {
  const { theme } = useSettingsStore();
  const systemScheme = useColorScheme();
  
  const activeTheme = theme === "System" ? (systemScheme === "dark" ? "Dark" : "Light") : theme;
  const colors = activeTheme === "Dark" ? darkColors : lightColors;
  
  return {
    ...themeBase,
    colors,
    isDark: activeTheme === "Dark",
  };
};

// Fallback for static parts if needed (though using the hook is preferred)
export const theme = {
  ...themeBase,
  colors: lightColors,
};
