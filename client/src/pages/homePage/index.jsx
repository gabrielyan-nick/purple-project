import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import {
  Navbar,
  UserWidget,
  MyPostWidget,
  PostsWidget,
  FriendListWidget,
  ErrorBoundary,
} from "components";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallScreens = useMediaQuery("(max-width: 600px)");
  const { _id, picturePath } = useSelector((state) => state.auth.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding={`20px ${!isSmallScreens ? "50px" : "10px"} `}
        display="flex"
        flexDirection={`${isNonMobileScreens ? "row" : "column"}`}
        gap="20px"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <ErrorBoundary>
            <UserWidget userId={_id} picturePath={picturePath} />
          </ErrorBoundary>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          maxWidth={isNonMobileScreens ? "45%" : undefined}
          flexBasis={isNonMobileScreens ? "45%" : undefined}
          sx={{ order: `${!isNonMobileScreens ? "1" : "0"}` }}
        >
          <ErrorBoundary>
            <MyPostWidget picturePath={picturePath} />
          </ErrorBoundary>
          <ErrorBoundary>
            <PostsWidget userId={_id} />
          </ErrorBoundary>
        </Box>

        <Box flexBasis="26%">
          <ErrorBoundary>
            <FriendListWidget userId={_id} />
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
