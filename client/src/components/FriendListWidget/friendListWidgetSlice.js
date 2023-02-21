import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  friendList: [],
};

export const getFriendList = createAsyncThunk(
  "friendList/getFriendList",
  async ({ userId, token }) => {
    const response = await fetch(`http://localhost:3001/users/${userId}/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const friends = await response.json();
    if (friends.message) return [];
    return friends;
  }
);

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFriendList.fulfilled, (state, action) => {
      state.friendList = action.payload;
    });
  },
});

export default friendListSlice.reducer;
