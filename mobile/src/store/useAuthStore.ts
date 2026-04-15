import { create } from "zustand";
import { api } from "../services/api";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: null | { email: string; username?: string; createdAt?: string };
  quizHistory: any[];
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: (skipBackendCall?: boolean) => Promise<void>;
  initialize: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchQuizHistory: () => Promise<void>;
}

const USER_STORAGE_KEY = "enrich_auth_user";

// Helper to handle secure storage differences between Web and Native
const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItem = async (key: string) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteStorageItem = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true, // Start loading while we check secure storage
  user: null,
  quizHistory: [],
  error: null,

  initialize: async () => {
    try {
      const storedUser = await getStorageItem(USER_STORAGE_KEY);

      if (storedUser) {
        set({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          isLoading: false,
        });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (e) {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      const response = await api.get("users/me");
      const userData = response.data;
      const userObj = {
        email: userData.email,
        username: userData.username,
        createdAt: userData.createdAt,
      };
      await setStorageItem(USER_STORAGE_KEY, JSON.stringify(userObj));
      set({ user: userObj });
    } catch (err) {
      console.warn("Failed to fetch user profile", err);
    }
  },

  fetchQuizHistory: async () => {
    try {
      const response = await api.get("users/me/history");
      set({ quizHistory: response.data || [] });
    } catch (err) {
      console.warn("Failed to fetch quiz history", err);
    }
  },

  login: async (email, password) => {
    try {
      set({ error: null });
      // Call the backend API to login (It will set an HTTP-only cookie on success)
      await api.post("auth/login", {
        email,
        password,
        rememberMe: true,
      });

      // Assuming your backend responds with 200 OK on success
      // We set a temporary userObj just to trigger isAuthenticated
      const userObj = { email }; 
      await setStorageItem(USER_STORAGE_KEY, JSON.stringify(userObj));
      set({ isAuthenticated: true, user: userObj });
      
      // Fetch full profile to get the actual username, createdAt, etc.
      // We use get() to access the current store methods
      await useAuthStore.getState().fetchUserProfile();
      
    } catch (err: any) {
      console.error("API Error Response:", err.response?.data || err.message);
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Login failed. Check your credentials.",
      });
    }
  },

  register: async (email, username, password) => {
    try {
      set({ error: null });
      // Call the backend API to register
      await api.post("auth/register", { email, username, password });

      const userObj = { email, username };
      await setStorageItem(USER_STORAGE_KEY, JSON.stringify(userObj));
      set({ isAuthenticated: true, user: userObj });
    } catch (err: any) {
      console.error("API Error Response:", err.response?.data || err.message);
      set({
        error:
          err.response?.data?.message || err.message || "Registration failed.",
      });
    }
  },

  logout: async (skipBackendCall = false) => {
    try {
      if (!skipBackendCall) {
        // Call the backend to clear the cookie
        await api.post("auth/logout");
      }
    } catch (err) {
      console.warn("Failed to logout from server", err);
    } finally {
      await deleteStorageItem(USER_STORAGE_KEY);
      set({ isAuthenticated: false, user: null, quizHistory: [] });
    }
  },
}));
