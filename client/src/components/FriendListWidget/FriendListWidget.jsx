import React, { useEffect, useState, useRef, useMemo, createRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Friend, WidgetWrapper, FlexBetweenBox } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { getMyFriendList } from "../../store";
import { getFriendList } from "./friendListWidgetSlice";
import "./styles.scss";

const FriendListWidget = ({ userId }) => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { friendList, listFixState } = useSelector(
    (state) => state.friendListWidget
  );
  const { friends, _id } = useSelector((state) => state.auth.user);
  const isMyList = _id === userId;
  const currentFriends = isMyList ? friends : friendList;
  const displayedFriends = showAll
    ? currentFriends
    : currentFriends.slice(0, 5);

  useEffect(() => {
    isMyList
      ? dispatch(getMyFriendList({ userId, token }))
      : dispatch(getFriendList({ userId, token }));
  }, [listFixState]);


  const friendRef = useMemo(
    () =>
      currentFriends.reduce((acc, { _id }) => {
        acc[_id] = createRef();
        return acc;
      }, {}),
    [currentFriends]
  ); // создаем обьект уникальных рефов для коректной работы анимации

  return (
    <WidgetWrapper>
      <FlexBetweenBox sx={{ mb: "15px" }}>
        <Typography variant="h5" fontWeight="500">
          Friend list
        </Typography>
        <Typography fontWeight="500">
          {currentFriends.length}{" "}
          {currentFriends.length === 1 ? "friend" : "friends"}
        </Typography>
      </FlexBetweenBox>

      <Box display="flex" flexDirection="column" gap="10px" alignItems="center">
        <TransitionGroup component={null}>
          {displayedFriends.map(
            ({ _id, firstName, lastName, location, picturePath }) => {
              if (_id !== undefined)
                return (
                  <CSSTransition
                    timeout={200}
                    key={`${_id}-${firstName}`}
                    classNames="friend"
                    nodeRef={friendRef[_id]}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Friend
                      key={_id}
                      friendId={_id}
                      name={`${firstName} ${lastName}`}
                      subtitle={location}
                      userPicturePath={picturePath}
                      isInProfilePage={!isMyList ? true : false}
                      ref={friendRef[_id]}
                    />
                  </CSSTransition>
                );
            }
          )}
        </TransitionGroup>

        {!currentFriends.length && !isMyList ? (
          <Typography py="15px">No friends. Be the first</Typography>
        ) : !currentFriends.length && isMyList ? (
          <Typography py="15px">No friends. But you are not alone</Typography>
        ) : null}
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
