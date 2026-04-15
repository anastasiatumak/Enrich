import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../localization/i18n";

export type AppTheme = "Light" | "Dark" | "System";
export type AppLanguage = "English" | "Ukrainian";

interface SettingsState {
  theme: AppTheme;
  language: AppLanguage;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: AppLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "Light",
      language: "English",
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => {
        const langCode = language === "Ukrainian" ? "uk" : "en";
        i18n.changeLanguage(langCode);
        set({ language });
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
