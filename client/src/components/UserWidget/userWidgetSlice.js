import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serverUrl } from "config";

const initialState = {
  userData: {},
  userLoadingStatus: "idle",
  userFixState: false, // Меняем переменную при сохранении измененных даных пользователя. При ее изменении запускается эффект для получения данных пользователя.
};

export const fetchUserData = createAsyncThunk(
  "userWidget/fetchUserData",
  async ({ userId, token }) => {
    const response = await fetch(`${serverUrl}/users/${userId}`, {
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
  reducers: {
    setUserFix: (state) => {
      state.userFixState = !state.userFixState;
    },
  },
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

export const { setUserFix } = userWidgetSlice.actions;
export default userWidgetSlice.reducer;
