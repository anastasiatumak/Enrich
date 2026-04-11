import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // 192.168.0.106 is your Windows PC's current Wi-Fi IP address.
    // By using this instead of "localhost", your Physical iPhone, Web Browser, 
    // and Android Emulators can ALL seamlessly connect to your backend!
    return 'http://192.168.0.106:5015/api'; 
  }
  
  // Production URL
  return 'https://your-production-domain.com/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
