import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../constants';
import axios from 'axios';

//initial State for the Profile
const initialState = {
  userData: null,
  hasApartment: false,
  isLoading: false,
  error: null,
};

export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (_, { rejectWithValue }) => {
    console.log('hey');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { 'x-auth-token': token },
      });
      return response.data;
    } catch (error) {
      // handle all types of errors
      if (error.response) {
        // if the server returns with error status
        return rejectWithValue(
          error.response.data?.message || 'Failed to fetch profile'
        );
      } else if (error.request) {
        // request has been sent but no response recived
        return rejectWithValue('Network error. Please check your connection.');
      } else {
        // something else
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const setApartmentStatus = createAsyncThunk(
  'profile/setApartmentStatus',
  async (selectedIndex, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication token was not found');
      }
      const response = await axios.put(
        `${API_BASE_URL}/profile/update-profile`,
        {
          updates: {
            hasApartment: selectedIndex === 1,
          },
        },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      return selectedIndex === 1;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update apartment status'
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder
      //fetch profile
      .addCase(fetchProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        console.log('🔁 fulfilled payload:', action.payload);

        state.userData = action.payload;
        state.hasApartment = action.payload.hasApartment;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //set apartment status
      .addCase(setApartmentStatus.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData.hasApartment = action.payload;
        }
        state.hasApartment = action.payload;
      })
      .addCase(setApartmentStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
