import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

// export const fetchForLogin = createAsyncThunk(
//   "user/fetchForLogin",
//   async (data) => {
//     try {
//       const req = await fetch("http://localhost:3001/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: data,
//       });
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

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
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("There are no friends :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchForLogin.fulfilled, (state, action) => {
  //       if (action.payload.user && action.payload.token) {
  //         state.user = action.payload.user;
  //         state.token = action.payload.token;
  //       }
  //     })
  // .addCase(fetchForLogin.rejected, (state) => {
  //   state.loginError = true;
  // });
  // },
});

export const { setMode, setLogout, setLogin, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
