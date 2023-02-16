import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../store";
import { PostWidget } from "../index";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const { posts, token } = useSelector((state) => state.auth);

  const getPosts = async () => {
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const posts = await response.json();
    dispatch(setPosts(posts));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const posts = await response.json();
    dispatch(setPosts(posts ));
  };

  useEffect(() => {
    isProfile ? getUserPosts() : getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
        }) => (
          <PostWidget
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
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
