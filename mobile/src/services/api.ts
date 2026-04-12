import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/useAuthStore';

const getBaseUrl = () => {
  if (__DEV__) {
    // Dynamically get the IP address of your PC where the Expo server is running.
    // This allows any phone or simulator on the same network to connect automatically!
    const debuggerHost = Constants.expoConfig?.hostUri;
    const ip = debuggerHost?.split(':')[0] || 'localhost';
    
    return `http://${ip}:5015/api/`; 
  }
  
  // Production URL
  return 'https://your-production-domain.com/api/';
};

const baseURL = getBaseUrl();
console.log('Backend API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(request => {
  console.log('Sending request to:', request.baseURL, request.url);
  return request;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Check if your backend is running and reachable.');
    } else if (!error.response) {
      console.error('Network error. Check your internet connection or backend IP.');
    } else if (error.response.status === 401) {
      // If the backend returns 401 Unauthorized, automatically log the user out
      // to clear stale frontend state.
      console.log("401 Unauthorized received. Automatically logging out...");
      const logout = useAuthStore.getState().logout;
      
      // Do not attempt to call the backend /logout endpoint if we are already unauthorized
      await logout(true); 
    }
    return Promise.reject(error);
  }
);
