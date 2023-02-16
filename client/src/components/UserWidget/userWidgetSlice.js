import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
  userLoadingStatus: "idle",
};

export const fetchUserData = createAsyncThunk(
  "userWidget/fetchUserData",
  async ({ userId, token }) => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  }
);

const userWidgetSlice = createSlice({
  name: "userWidget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.userLoadingStatus = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userLoadingStatus = "idle";
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.userLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

export default userWidgetSlice.reducer;
