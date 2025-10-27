import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, signupThunk, logoutThunk, forgotPasswordThunk, resetPasswordThunk } from '../thunks/authThunks';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  forgotPasswordStep: 1,
  resetEmail: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setForgotPasswordStep: (state, action) => {
      state.forgotPasswordStep = action.payload.step;
      state.resetEmail = action.payload.email || state.resetEmail;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Forgot Password
    builder
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.forgotPasswordStep = 2;
        state.resetEmail = action.meta.arg.email;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.forgotPasswordStep = 1;
        state.resetEmail = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, setForgotPasswordStep, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;