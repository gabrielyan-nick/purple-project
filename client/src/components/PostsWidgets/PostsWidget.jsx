import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, lazzyLoadPosts } from "./postsWidgetsSlice";
import { PostWidgetMemo } from "../index";
import { Box } from "@mui/system";
import useOnIntersection from "hooks/useOnIntersection";
import { CircularProgress } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const postsReloadFix = useSelector(
    (state) => state.postsWidget.postsReloadFix
  );
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { posts, isEndOfList, postsLoadingStatus } = useSelector(
    (state) => state.postsWidget
  );
  const pageBottomRef = useOnIntersection(lazzyLoadingPosts);
  const location = useLocation();

  useEffect(() => {
    isProfile
      ? dispatch(fetchPosts({ token, userId, isUsersPosts: true }))
      : dispatch(fetchPosts({ token }));
  }, [postsReloadFix]);

  useEffect(() => {
    setOffset(0);
  }, [location]);

  function lazzyLoadingPosts() {
    if (!isEndOfList && postsLoadingStatus !== "loading") {
      setOffset((offset) => offset + limit);
      isProfile
        ? dispatch(
            lazzyLoadPosts({ token, userId, offset, isUsersPosts: true })
          )
        : dispatch(lazzyLoadPosts({ token, userId, offset }));
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap="20px" alignItems="center">
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt,
        }) => (
          <PostWidgetMemo
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        )
      )}
      {postsLoadingStatus === "loading" && <CircularProgress />}
      <Box ref={pageBottomRef}></Box>
    </Box>
  );
};

export default PostsWidget;
