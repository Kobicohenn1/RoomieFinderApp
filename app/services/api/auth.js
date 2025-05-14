import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './index';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  login: async (cardentials) => {
    const response = await api.post('login', cardentials);
    const { token, userId } = response.data;
    if (token && userId) {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);
    }
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    return { success: true };
  },
};
