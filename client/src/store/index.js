import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serverUrl } from "config";

const initialState = {
  mode: "light",
  user: null,
  token: null,
};

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ id, formData, token, initData }) => {
    const response = await fetch(
      `${serverUrl}/users/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const user = await response.json();
    if (user.message) return initData;
    return user;
  }
);

export const patchFriend = createAsyncThunk(
  "user/patchFriend",
  async ({ _id, friendId, token }) => {
    const response = await fetch(
      `${serverUrl}/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const friends = await response.json();
    if (friends.message) return [];
    return friends;
  }
);

export const getMyFriendList = createAsyncThunk(
  "user/getMyFriendList",
  async ({ userId, token }) => {
    const response = await fetch(
      `${serverUrl}/users/${userId}/friends`,
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(patchFriend.fulfilled, (state, action) => {
        if (state.user) {
          state.user.friends = action.payload;
        } else {
          console.error("There are no friends :(");
        }
      })
      .addCase(getMyFriendList.fulfilled, (state, action) => {
        state.user.friends = action.payload;
      })
      .addCase(updateUserData.pending, (state) => {})
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setMode, setLogout, setLogin } = authSlice.actions;
export default authSlice.reducer;
