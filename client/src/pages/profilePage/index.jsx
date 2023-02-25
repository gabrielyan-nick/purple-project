import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import {
  Navbar,
  UserWidget,
  MyPostWidget,
  PostsWidget,
  FriendListWidget,
} from "components";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallScreens = useMediaQuery("(max-width: 600px)");

  const getUserInfo = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!user) return null;

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
          <UserWidget userId={userId} picturePath={user.picturePath} />
        </Box>
        <Box
          maxWidth={isNonMobileScreens ? "45%" : undefined}
          flexBasis={isNonMobileScreens ? "45%" : undefined}
          mt={isNonMobileScreens ? undefined : "20px"}
        >
          <PostsWidget userId={userId} isProfile />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget userId={userId} isMyList={false} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
