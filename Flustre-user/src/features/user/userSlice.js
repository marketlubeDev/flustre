import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  emailForVerification: null,
  otpExpiresAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setEmailForVerification: (state, action) => {
      state.emailForVerification = action.payload;
    },
    clearEmailForVerification: (state, action) => {
      state.emailForVerification = null;
    },
    startOtpTimer: (state, action) => {
      const seconds = Number(action.payload) || 30;
      state.otpExpiresAt = Date.now() + seconds * 1000;
    },
    clearOtpTimer: (state) => {
      state.otpExpiresAt = null;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const {
  setUser,
  setIsLoggedIn,
  logout,
  setEmailForVerification,
  clearEmailForVerification,
  startOtpTimer,
  clearOtpTimer,
} = userSlice.actions;

export const selectOtpRemainingSeconds = (state) =>
  state.user.otpExpiresAt
    ? Math.max(0, Math.ceil((state.user.otpExpiresAt - Date.now()) / 1000))
    : 0;

export default userSlice.reducer;
