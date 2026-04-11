import axios from 'axios';
import Constants from 'expo-constants';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Check if your backend is running and reachable.');
    } else if (!error.response) {
      console.error('Network error. Check your internet connection or backend IP.');
    }
    return Promise.reject(error);
  }
);
