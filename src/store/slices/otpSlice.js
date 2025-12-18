import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resendOtp, verifyOtp } from "../../services/authService";

export const verifyOTP = createAsyncThunk(
  "otp/verify",
  async (data, { rejectWithValue }) => {
    try {
      return await verifyOtp(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "otp/resend",
  async (email, { rejectWithValue }) => {
    try {
      return await resendOtp(email);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOtpState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;
