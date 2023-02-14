import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { UserImage, FlexBetweenBox, WidgetWrapper } from "components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getUser();
  }, []);

  const onNavigate = () => {
    navigate(`/profile/${userId}`);
  };

  if (!user) return null;

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetweenBox gap="10px" pb="10px">
        <FlexBetweenBox gap="20px">
          <UserImage image={picturePath} navigate={onNavigate} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="500"
              sx={{
                cursor: "pointer",
              }}
              onClick={onNavigate}
              
            >
              {firstName} {lastName}
            </Typography>
            <Typography>{friends.length} friends</Typography>
          </Box>
        </FlexBetweenBox>
        <ManageAccountsOutlined
          sx={{ color: palette.primary.main, cursor: "pointer" }}
        />
      </FlexBetweenBox>
      <Divider />
      {/* SECOND ROW */}
      <Box py="10px">
        <Box display="flex" alignItems="center" gap="10px" mb="5px">
          <LocationOnOutlined sx={{ color: palette.primary.main }} />
          <Typography>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <WorkOutlineOutlined sx={{ color: palette.primary.main }} />
          <Typography>{occupation}</Typography>
        </Box>
      </Box>
      <Divider />
      {/* THIRD ROW */}
      <Box py="10px">
        <FlexBetweenBox mb="10px">
          <Typography>Who's viewed your profile</Typography>
          <Typography fontWeight="500">{viewedProfile}</Typography>
        </FlexBetweenBox>
        <FlexBetweenBox>
          <Typography>Impressions of your post</Typography>
          <Typography fontWeight="500">{impressions}</Typography>
        </FlexBetweenBox>
      </Box>
      <Divider />
      {/* FOURTH ROW */}
      <Box py="10px">
        <Typography fontWeight="500" mb="10px">
          Social profiles
        </Typography>

        <FlexBetweenBox gap="10px" mb="10px">
          <FlexBetweenBox gap="10px">
            <img
              src="../assets/twitter.png"
              alt="twitter"
              style={{ cursor: "pointer" }}
            />
            <Box>
              <Typography fontWeight="500" sx={{ cursor: "pointer" }}>
                Twitter
              </Typography>
              <Typography>Social network</Typography>
            </Box>
          </FlexBetweenBox>
          <EditOutlined
            sx={{ color: palette.primary.main, cursor: "pointer" }}
          />
        </FlexBetweenBox>

        <FlexBetweenBox gap="10px">
          <FlexBetweenBox gap="10px">
            <img
              src="../assets/linkedin.png"
              alt="linkedin"
              style={{ cursor: "pointer" }}
            />
            <Box>
              <Typography fontWeight="500" sx={{ cursor: "pointer" }}>
                LindedIn
              </Typography>
              <Typography>Network platform</Typography>
            </Box>
          </FlexBetweenBox>
          <EditOutlined
            sx={{ color: palette.primary.main, cursor: "pointer" }}
          />
        </FlexBetweenBox>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
