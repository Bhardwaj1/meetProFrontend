import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../../services/authService";


export const register = createAsyncThunk(
"auth/register",
async (data, { rejectWithValue }) => {
try {
return await registerUser(data);
} catch (error) {
return rejectWithValue(error);
}
}
);


const authSlice = createSlice({
name: "auth",
initialState: {
user: null,
loading: false,
error: null,
success: false,
},
reducers: {
resetAuthState: (state) => {
state.loading = false;
state.error = null;
state.success = false;
},
},
extraReducers: (builder) => {
builder
.addCase(register.pending, (state) => {
state.loading = true;
state.error = null;
})
.addCase(register.fulfilled, (state, action) => {
state.loading = false;
state.success = true;
state.user = action.payload;
})
.addCase(register.rejected, (state, action) => {
state.loading = false;
state.error = action.payload;
});
},
});


export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;