import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/api/auth';

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
    try {
      const registerResponse = await authService.register({
        username,
        email,
        password,
      });
      const loginData = await authService.login({ email, password });
      return { ...registerData, ...loginData, isLoggedIn: true };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

//Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authService.login({ email, password });
    } catch (error) {
      return rejectWithValue(error.message || 'Faild to log in');
    }
  }
);

//Async Thunk for the logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.logout();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to logout');
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
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload.success) {
          state.isLoggedIn = false;
          state.token = null;
          state.userId = null;
        }
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
