import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import otpReducer from "./slices/otpSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpReducer,
  },
  devTools: import.meta.env.DEV,
});
