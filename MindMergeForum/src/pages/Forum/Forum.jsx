import { useState, useEffect, useContext} from "react";
import { getPosts, deletePost} from "../../../services/posts.services";
import { auth } from "../../config/firebase.config";
import {useNavigate} from 'react-router-dom'
import { getUserById } from "../../../services/user.services";
import { Roles } from "../../../common/roles.enum";
import { AppContext } from "../../store/app.context";

export default function Forum() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState({});
  const [userHandles, setUserHandles] = useState({});
  const navigation = useNavigate();

useEffect(()=>{
  const fetchPostsAndHandles = async () => {
    try {
      const data = await getPosts();
      setPosts(data||{});

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
}, [])

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

  return (
    <div>
    <h2>Forum</h2>
    {Object.keys(posts).length === 0 ? (
      <p>No posts available</p>
    ) : (
      Object.entries(posts).map(([postId, post]) => (
        <div key={postId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{post.title}</h3>
          <h6>Created by: {userHandles[post.userId]}</h6>
          <p>{post.content}</p>
          <p>❤️ {post.likes ? post.likes.length : 0} </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { navigation(`/posts/${postId}`) }}>See More</button>
            {(auth.currentUser && auth.currentUser.uid === post.userId) || (userData && userData.role === Roles.admin) ? (
                <button onClick={() => handleDelete(postId)}>Delete</button>
              ) : null}
          </div>
        </div>
      ))
    )}
  </div>
);
}