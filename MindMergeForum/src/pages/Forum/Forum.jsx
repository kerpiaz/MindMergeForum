import { useState, useEffect } from "react";
import { getPosts, likePost, deletePost } from "../../../services/posts.service";
import { auth } from "../../config/firebase.config";

export default function Forum() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  const handleLike = async (postId, likes) => {
    await likePost(postId, likes);
    setPosts((prevPosts) => ({
      ...prevPosts,
      [postId]: { ...prevPosts[postId], likes: likes + 1 }
    }));
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts((prevPosts) => {
      const updatedPosts = { ...prevPosts };
      delete updatedPosts[postId];
      return updatedPosts;
    });
  };

  return (
    <div>
      <h2>Форум</h2>
      {Object.entries(posts).map(([postId, post]) => (
        <div key={postId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>❤️ {post.likes}</p>
          <button onClick={() => handleLike(postId, post.likes)}>Харесай</button>
          {auth.currentUser && auth.currentUser.uid === post.userId && (
            <button onClick={() => handleDelete(postId)}>Изтрий</button>
          )}
        </div>
      ))}
    </div>
  );
}