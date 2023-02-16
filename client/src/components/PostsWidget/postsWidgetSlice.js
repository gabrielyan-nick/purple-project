import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  postsLoadingStatus: "idle",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ token }) => {
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const posts = await response.json();
    return posts;
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async ({ userId, token }) => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const posts = await response.json();
    return posts;
  }
);

const postsWidgetSlice = createSlice({
name: 'postsWidget',
initialState,
reducers: {},
extraReducers: 
})
