import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { meetingHistoryService } from "../../services/meetingHistoryService";

export const getMeetingHistory = createAsyncThunk(
  "meetingHistory/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await meetingHistoryService.get(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const meetingHistorySlice = createSlice({
  name: "meetingHistory",
  initialState: {
    loading: false,
    error: null,
    meetingHistory: [],
    meta: null,
  },
  reducers: {
    resetMeetingHistoryError: (state) => {
      state.error = null;
    },
    clearMeetingHistory: (state) => {
      state.loading = false;
      state.error = null;
      state.meetingHistory = [];
      state.meta = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeetingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeetingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingHistory = action.payload?.data || [];
        state.meta = action.payload?.meta || null;
      })
      .addCase(getMeetingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMeetingHistoryError, clearMeetingHistory } =
  meetingHistorySlice.actions;
export default meetingHistorySlice.reducer;
