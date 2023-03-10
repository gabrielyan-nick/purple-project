import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./index.js";
import userWidgetReducer from "../components/UserWidget/userWidgetSlice";
import postsWidgetReducer from "../components/PostsWidgets/postsWidgetsSlice";
import friendListWidgetReducer from "components/FriendListWidget/friendListWidgetSlice.js";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  auth: authReducer,
  userWidget: userWidgetReducer,
  postsWidget: postsWidgetReducer,
  friendListWidget: friendListWidgetReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistedStore = persistStore(store);
