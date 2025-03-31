import { Platform } from 'react-native';

// Get your computer's local IP address
const LOCAL_IP = '192.168.10.10'; // Your computer's IP address

// Remove trailing slash from API URL
export const API_BASE_URL = Platform.select({
  ios: `http://${LOCAL_IP}:3500/api`,
  android: `http://${LOCAL_IP}:3500/api`,
  default: `http://${LOCAL_IP}:3500/api`,
});

// Remove trailing slash from base URL
export const BASE_URL = Platform.select({
  ios: `http://${LOCAL_IP}:3500`,
  android: `http://${LOCAL_IP}:3500`,
  default: `http://${LOCAL_IP}:3500`,
});

// Default image if profile image fails to load
export const DEFAULT_PROFILE_IMAGE = require('../assets/images/profile.png');
