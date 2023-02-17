import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  postsLoadingStatus: "idle",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (token) => {
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const posts = await response.json();
    if (posts.message) return [];
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
    if (posts.message) return [];
    return posts;
  }
);

export const addMyPost = createAsyncThunk(
  "posts/addMyPost",
  async ({ formData, token, initPosts }) => {
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    if (posts.message) return initPosts;
    return posts;
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, data, token }) => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const post = await response.json();
    if (post.message) return [];
    return post;
  }
);

export const patchLike = createAsyncThunk(
  "posts/patchLike",
  async ({ postId, token, loggedInUserId }) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    return updatedPost;
  }
);

const postsWidgetSlice = createSlice({
  name: "postsWidget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.postsLoadingStatus = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsLoadingStatus = "idle";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.postsLoadingStatus = "error";
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.postsLoadingStatus = "loading";
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.postsLoadingStatus = "idle";
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state) => {
        state.postsLoadingStatus = "error";
      })
      .addCase(addMyPost.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(patchLike.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload;
          return post;
        });
        state.posts = updatedPosts;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload;
          return post;
        });
        state.posts = updatedPosts;
      });
  },
});

export default postsWidgetSlice.reducer;
