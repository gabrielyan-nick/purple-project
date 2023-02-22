import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Friend, WidgetWrapper, FlexBetweenBox } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { getMyFriendList } from "../../store";
import { getFriendList } from "./friendListWidgetSlice";

const FriendListWidget = ({ userId, isMyList = true }) => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { friends } = useSelector((state) => state.auth.user);
  const { friendList, listFixState } = useSelector(
    (state) => state.friendListWidget
  );
  const currentFriends = isMyList ? friends : friendList;
  const displayedFriends = showAll
    ? currentFriends
    : currentFriends.slice(0, 5);

  useEffect(() => {
    isMyList
      ? dispatch(getMyFriendList({ userId, token }))
      : dispatch(getFriendList({ userId, token }));
  }, [listFixState]);

  return (
    <WidgetWrapper>
      <FlexBetweenBox sx={{ mb: "15px" }}>
        <Typography variant="h5" fontWeight="500">
          Friend list
        </Typography>
        <Typography fontWeight='500'>
          {currentFriends.length}{" "}
          {currentFriends.length === 1 ? "friend" : "friends"}
        </Typography>
      </FlexBetweenBox>

      <Box display="flex" flexDirection="column" gap="10px" alignItems="center">
        {displayedFriends.map(
          ({ _id, firstName, lastName, location, picturePath }) => (
            <Friend
              key={_id}
              friendId={_id}
              name={`${firstName} ${lastName}`}
              subtitle={location}
              userPicturePath={picturePath}
              isInProfilePage={!isMyList ? true : false}
            />
          )
        )}
        {!currentFriends.length && (
          <Typography py='15px'>No friends. Be the first</Typography>
        )}
      </Box>

      {currentFriends.length > 5 && (
        <Button
          fullWidth
          variant="text"
          sx={{ marginTop: "10px" }}
          onClick={() => setShowAll(!showAll)}
        >
          {`${showAll ? "Hide" : "Show all"}`}
        </Button>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
// Функция вызывается в компоненте Friend при нажатии на кнопку добавить/удалить друга.
//  Изменение значения listFix вызывает еффект в этом компоненте.
// Помогает избежать бесконечного цикла при вызова еффекта с зависимостями currentFriends, friendList, friends
