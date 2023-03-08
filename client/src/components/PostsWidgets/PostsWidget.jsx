import React, { useEffect, useState, useRef, createRef, useMemo } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, lazzyLoadPosts } from "./postsWidgetsSlice";
import { PostWidget, WidgetWrapper } from "../index";
import { Box } from "@mui/system";
import useOnIntersection from "hooks/useOnIntersection";
import { CircularProgress, Typography } from "@mui/material";
import "./styles.scss";

const PostsWidget = ({ userId, offset, setOffset, isProfile = false }) => {
  const [limit, setLimit] = useState(5);
  const postsReloadFix = useSelector(
    (state) => state.postsWidget.postsReloadFix
  );
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { posts, isEndOfList, postsLoadingStatus } = useSelector(
    (state) => state.postsWidget
  );
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const isMyWidget = loggedInUserId === userId;
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
      if (!isEndOfList) {
        setOffset((offset) => offset + limit);
        isProfile
          ? dispatch(
              lazzyLoadPosts({ token, userId, offset, isUsersPosts: true })
            )
          : dispatch(lazzyLoadPosts({ token, userId, offset }));
      }
    }
  }

  const postRef = useMemo(
    () =>
      posts.reduce((acc, { _id }) => {
        acc[_id] = createRef();
        return acc;
      }, {}),
    [posts]
  ); // создаем обьект уникальных рефов для коректной работы анимации

  return (
    <Box display="flex" flexDirection="column" gap="20px" alignItems="center">
      {posts.length !== 0 ? (
        <TransitionGroup component={null}>
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
              <CSSTransition
                timeout={200}
                key={_id}
                classNames="post"
                nodeRef={postRef[_id]}
                mountOnEnter
                unmountOnExit
              >
                <PostWidget
                  key={`${_id}-${createdAt}`}
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
                  ref={postRef[_id]}
                />
              </CSSTransition>
            )
          )}
        </TransitionGroup>
      ) : (
        <WidgetWrapper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
            }}
          >
            <Typography>
              {isMyWidget ? "You have not posts...yet" : "No posts...yet"}
            </Typography>
          </Box>
        </WidgetWrapper>
      )}
      {postsLoadingStatus === "loading" && <CircularProgress />}
      <Box ref={pageBottomRef}></Box>
    </Box>
  );
};

export default PostsWidget;
