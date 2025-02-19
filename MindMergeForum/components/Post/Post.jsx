import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../src/store/app.context";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../src/config/firebase.config";

export default function Post() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const postRef = ref(db, `posts/${id}`);
    const unsubscribe = onValue(
      postRef,
      (snapshot) => {
        const postData = snapshot.val();
        if (postData) {
          setPost(postData);
        } else {
          setPost(null);
        }
      },
      (error) => {
        console.error("Firebase read error:", error);
        setPost(null);
      }
    );

    return () => unsubscribe();
  }, [id]);

  if (post === null) {
    return <div>Loading...</div>;
  }

  const handleLike = () => {
    if (!user) return;

    const postRef = ref(db, `posts/${id}`);
    const updatedLikedBy = { ...(post.likedBy || {}) };

    if (updatedLikedBy[user.uid]) {
      delete updatedLikedBy[user.uid];
    } else {
      updatedLikedBy[user.uid] = true;
    }

    update(postRef, { likedBy: updatedLikedBy }).then(() => {
      setPost((prevPost) => ({
        ...prevPost,
        likedBy: updatedLikedBy
      }));
    });
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Created by: {post.userId}</p>
      <p>Created on: {new Date(post.createdOn).toLocaleDateString()}</p>
      <p>Likes: {post.likedBy ? Object.keys(post.likedBy).length : 0}</p>
      {user && (
        <button onClick={handleLike}>
          {post.likedBy && post.likedBy[user.uid] ? "Unlike" : "Like"}
        </button>
      )}
    </div>
  );
}
