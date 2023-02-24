import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchUserPosts } from "./postsWidgetsSlice";
import { PostWidgetMemo } from "../index";
import { Box } from "@mui/system";

const PostsWidget = ({ userId, isProfile = false }) => {
  const postsReloadFix = useSelector(state => state.postsWidget.postsReloadFix)
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { posts } = useSelector((state) => state.postsWidget);

  useEffect(() => {
    isProfile
      ? dispatch(fetchUserPosts({ userId, token }))
      : dispatch(fetchPosts(token));
  }, [postsReloadFix]);

  return (
    <Box display='flex' flexDirection='column' gap='20px'>
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
    </Box>
  );
};

export default PostsWidget;
