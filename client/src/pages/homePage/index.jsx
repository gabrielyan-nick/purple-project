import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import {
  Navbar,
  UserWidget,
  MyPostWidget,
  PostsWidget,
  FriendListWidget,
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
        display={isNonMobileScreens ? "flex" : "block"}
        gap="15px"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          maxWidth={isNonMobileScreens ? "45%" : undefined}
          flexBasis={isNonMobileScreens ? "45%" : undefined}
          mt={isNonMobileScreens ? undefined : "20px"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
