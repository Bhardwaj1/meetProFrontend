import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { meetingService } from "../../services/meetingService";

export const createMeeting = createAsyncThunk(
  "meeting/createInstant",
  async (payload, { rejectWithValue }) => {
    try {
      return await meetingService.createInstant(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const scheduleMeeting = createAsyncThunk(
  "meeting/schedule",
  async (payload, { rejectWithValue }) => {
    try {
      return await meetingService.schedule(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const startMeeting = createAsyncThunk(
  "meeting/start",
  async ({ meetingId }, { rejectWithValue }) => {
    try {
      return await meetingService.start({ meetingId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const joinMeeting = createAsyncThunk(
  "meeting/join",
  async (meetingId, { rejectWithValue }) => {
    try {
      return await meetingService.join({ meetingId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const leaveMeeting = createAsyncThunk(
  "meeting/leave",
  async ({ meetingId }, { rejectWithValue }) => {
    try {
      return await meetingService.leave({ meetingId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const endMeeting = createAsyncThunk(
  "meeting/end",
  async ({ meetingId }, { rejectWithValue }) => {
    try {
      return await meetingService.end({ meetingId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMeetingDetails = createAsyncThunk(
  "meeting/details",
  async (meetingId, { rejectWithValue }) => {
    try {
      return await meetingService.getDetails(meetingId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const meetingSlice = createSlice({
  name: "meeting",
  initialState: {
    loading: false,
    error: null,
    scheduledMeeting: null,

    // Current meeting context
    currentMeeting: null, // { meetingId, hostId, participants, ... }
    meetingId: null, // quick access for routing
  },
  reducers: {
    resetMeetingError: (state) => {
      state.error = null;
    },
    clearCurrentMeeting: (state) => {
      state.currentMeeting = null;
      state.scheduledMeeting = null;
      state.meetingId = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingId = action.payload?.meetingId || null;
        state.currentMeeting = action.payload || null;
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SCHEDULE
      .addCase(scheduleMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduledMeeting = action.payload || null;
      })
      .addCase(scheduleMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // START
      .addCase(startMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingId = action.payload?.meetingId || null;
        state.currentMeeting = action.payload || null;
      })
      .addCase(startMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // JOIN
      .addCase(joinMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeeting = action.payload || null;
      })
      .addCase(joinMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LEAVE
      .addCase(leaveMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveMeeting.fulfilled, (state) => {
        state.loading = false;
        // On leave we typically clear meeting context locally
        state.currentMeeting = null;
        state.meetingId = null;
      })
      .addCase(leaveMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // END
      .addCase(endMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endMeeting.fulfilled, (state) => {
        state.loading = false;
        state.currentMeeting = null;
        state.meetingId = null;
      })
      .addCase(endMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DETAILS
      .addCase(fetchMeetingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeeting = action.payload || null;
        state.meetingId = action.payload?.meetingId || state.meetingId;
      })
      .addCase(fetchMeetingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMeetingError, clearCurrentMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
