import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serverUrl } from "config";

const initialState = {
  friendList: [],
  listFixState: false, // При изменении значения в компонентах UserWidget и FriendListWidget запускается еффект обновления списка, другие возможные переменные вызывают бесконечный цикл.
};

export const getFriendList = createAsyncThunk(
  "friendList/getFriendList",
  async ({ userId, token }) => {
    const response = await fetch(
      `${serverUrl}/${userId}/friends`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const friends = await response.json();
    if (friends.message) return [];
    return friends;
  }
);

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    setListFix: (state) => {
      state.listFixState = !state.listFixState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFriendList.fulfilled, (state, action) => {
      state.friendList = action.payload;
    });
  },
});

export const { setListFix } = friendListSlice.actions;
export default friendListSlice.reducer;
