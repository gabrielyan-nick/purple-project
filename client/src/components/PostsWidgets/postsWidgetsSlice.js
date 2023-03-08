import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  postsLoadingStatus: "idle",
  postsReloadFix: false, // Меняем значение при изменении данных пользователя. Изменение запускает эффект обновления постов.
  isEndOfList: false,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ token, userId = null, isUsersPosts = false }) => {
    const response = await fetch(
      `http://localhost:3001/posts${
        isUsersPosts ? `/${userId}/posts` : ""
      }?offset=0&limit=6`,
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

export const lazzyLoadPosts = createAsyncThunk(
  "posts/lazzyLoadPosts",
  async ({ token, userId, offset, limit = 5, isUsersPosts = false }) => {
    const response = await fetch(
      `http://localhost:3001/posts${
        isUsersPosts ? `/${userId}/posts` : ""
      }?offset=${offset}&limit=${limit}`,
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

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, token }) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const posts = await response.json();
    if (posts.message) return [];
    return { posts, postId };
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, data, token }) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const posts = await response.json();
    if (posts.message) return [];
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

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId, token }) => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const post = await response.json();
    if (post.message) return [];
    return post;
  }
);

export const updateComment = createAsyncThunk(
  "posts/updateComment",
  async ({ postId, commentId, data, token }) => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment/${commentId}`,
      {
        method: "PUT",
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
  reducers: {
    setPostsReloadFix: (state) => {
      state.postsReloadFix = !state.postsReloadFix;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.postsLoadingStatus = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isEndOfList = false;
        state.posts = action.payload;
        state.postsLoadingStatus = "idle";
        if (action.payload.length < 5) {
          state.isEndOfList = true;
        }
      })
      .addCase(lazzyLoadPosts.pending, (state) => {
        state.postsLoadingStatus = "loading";
      })
      .addCase(lazzyLoadPosts.fulfilled, (state, action) => {
        state.isEndOfList = false;
        state.posts = state.posts
          .concat(action.payload)
          .filter(
            (item, i, self) => i === self.findIndex((j) => j._id === item._id)
          );
        state.postsLoadingStatus = "idle";
        if (action.payload.length < 5) {
          state.isEndOfList = true;
        }
      })
      .addCase(addMyPost.fulfilled, (state, action) => {
        state.posts = state.posts
          .concat(action.payload)
          .filter(
            (item, i, self) => i === self.findIndex((j) => j._id === item._id)
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        state.isEndOfList = false;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts
          .concat(action.payload.posts)
          .filter(
            (item, i, self) =>
              i === self.findIndex((j) => j._id === item._id) &&
              item._id !== action.payload.postId
          );
        state.isEndOfList = false;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
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
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload;
          return post;
        });
        state.posts = updatedPosts;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload;
          return post;
        });
        state.posts = updatedPosts;
      });
  },
});

export const { setPostsReloadFix } = postsWidgetSlice.actions;
export default postsWidgetSlice.reducer;
