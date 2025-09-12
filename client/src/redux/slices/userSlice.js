import { createSlice } from '@reduxjs/toolkit';

// Parse user data from localStorage if it exists
let storedUser = {};
try {
  const userData = localStorage.getItem('user');
  if (userData) {
    storedUser = JSON.parse(userData);
  }
} catch (error) {
  console.error('Error parsing user data from localStorage:', error);
}

const initialState = {
  user: storedUser,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
  tokens: {
    access: localStorage.getItem('access_token') || null,
    refresh: localStorage.getItem('refresh_token') || null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      localStorage.setItem('access_token', action.payload.tokens.access);
      localStorage.setItem('refresh_token', action.payload.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    verifyEmailStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    verifyEmailSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      localStorage.setItem('access_token', action.payload.tokens.access);
      localStorage.setItem('refresh_token', action.payload.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    verifyEmailFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateTokens: (state, action) => {
      state.tokens.access = action.payload.access;
      localStorage.setItem('access_token', action.payload.access);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.tokens = { access: null, refresh: null };
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailFailure,
  updateTokens,
  logout,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
