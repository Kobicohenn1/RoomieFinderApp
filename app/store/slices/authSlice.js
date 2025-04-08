import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  token: null,
  userId: null,
};

//Async thunk for sign up

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    let registerResponse;
    try {
      registerResponse = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || 'Registration failed'
      );
    }
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const { token, userId } = loginResponse.data;

      if (!token || !userId) {
        return rejectWithValue('Token or user id missing in the response');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

      return {
        registerData: registerResponse.data,
        token,
        userId,
        isLoggedIn: true,
      };
    } catch (error) {
      return rejectWithValue('Login after registration failed');
    }
  }
);

//Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const { token, userId } = response.data;
      if (!token || !userId) {
        return rejectWithValue('Token or user Id is missing in the response');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

      return { token, userId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Faild to log in'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //for explaintion to me
    //builder for login include all cases of the Async thunk(pending,fulfilled,rejected)
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.error = null;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload.isLoggedIn) {
          state.isLoggedIn = true;
          state.token = action.payload.token;
          state.userId = action.payload.userId;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
