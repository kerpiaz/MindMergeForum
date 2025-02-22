import { useState, useEffect, useContext } from "react";
import { getPosts, deletePost, updatePost } from "../../../services/posts.services";
import { getUserById } from "../../../services/user.services";
import { AppContext } from "../../store/app.context";
import ForumRender from "../../../components/ForumRender/ForumRender";

export default function Forum() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState({});
  const [userHandles, setUserHandles] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchPostsAndHandles = async () => {
      try {
        const data = await getPosts();
        setPosts(data || {});

        const handles = {};
        for (const postId in data) {
          const post = data[postId];
          const userData = await getUserById(post.userId);
          handles[post.userId] = userData ? userData.handle : "Unknown User";
        }
        setUserHandles(handles);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPostsAndHandles();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => {
        const updatedPosts = { ...prevPosts };
        delete updatedPosts[postId];
        return updatedPosts;
      });
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  const handleEdit = (postId, title, content) => {
    setEditingPost(postId);
    setEditedTitle(title);
    setEditedContent(content);
  };

  const handleSaveEdit = async (postId) => {
    try {
      await updatePost(postId, { title: editedTitle, content: editedContent });
      setPosts((prevPosts) => ({
        ...prevPosts,
        [postId]: { ...prevPosts[postId], title: editedTitle, content: editedContent },
      }));
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div>
      <h2>Forum</h2>
      {Object.keys(posts).length === 0 ? (
        <p>No posts available</p>
      ) : (
        Object.entries(posts).map(([postId, post]) => (
          <ForumRender
            key={postId}
            postId={postId}
            post={post}
            userHandles={userHandles}
            editingPost={editingPost}
            editedTitle={editedTitle}
            editedContent={editedContent}
            setEditedTitle={setEditedTitle}
            setEditedContent={setEditedContent}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            userData={userData}
          />
        ))
      )}
    </div>
  );
}