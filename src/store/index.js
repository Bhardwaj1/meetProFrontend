import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import otpReducer from "./slices/otpSlice";
import meetingSlice from "./slices/meetingSlice";
import meetingHistoryReducer from "./slices/meetingHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpReducer,
    meeting: meetingSlice,
    meetingHistory: meetingHistoryReducer,
  },
  devTools: import.meta.env.DEV,
});
