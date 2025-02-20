import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../src/store/app.context";
import { ref, onValue, update, push } from "firebase/database";
import { db } from "../../src/config/firebase.config";
import { getUserById } from "../../services/user.services";

export default function Post() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [postCreatorHandle, setPostCreatorHandle] = useState("");

  useEffect(() => {
    const postRef = ref(db, `posts/${id}`);
    const unsubscribe = onValue(
      postRef,
      (snapshot) => {
        const postData = snapshot.val();
        if (postData) {
          setPost(postData);
          getUserById(postData.userId).then((userData) => {
            if (userData) {
              setPostCreatorHandle(userData.handle);
            }
          });
        } else {
          setPost(null);
        }
      },
      (error) => {
        console.error(error.message);
        setPost(null);
      }
    );

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (user) {
      getUserById(user.uid).then((userData) => {
        if (userData) {
          setUserHandle(userData.handle);
        }
      });
    }
  }, [user]);

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
        likedBy: updatedLikedBy,
      }));
    });
  };

  const handleCommentSubmit = () => {
    if (!user || comment.trim() === "") return;

    const commentsRef = ref(db, `posts/${id}/comments`);
    const newComment = {
      text: comment,
      userId: user.uid,
      userHandle: userHandle,
      createdOn: Date.now(),
    };

    push(commentsRef, newComment).then(() => {
      setComment("");
    }).catch((error) => {
      console.error("Error adding comment:", error.message);
    });
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingComment(commentId);
    setEditedText(currentText);
  };

  const handleSaveEdit = (commentId) => {
    if (editedText.trim() === "") return;

    const commentRef = ref(db, `posts/${id}/comments/${commentId}`);
    update(commentRef, { text: editedText }).then(() => {
      setEditingComment(null);
      setEditedText("");
    }).catch((error) => {
      console.error("Error saving comment:", error.message);
    });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px",  width: "600px"}}>
      <div>
      <h2>{post.title}</h2>
      <h6>Created by: {postCreatorHandle}{" "}
      | Created on: {new Date(post.createdOn).toLocaleString()}</h6>
      <p>{post.content}</p>
      <p>❤️ {post.likedBy ? Object.keys(post.likedBy).length : 0} 💬 {post.comments? Object.keys(post.comments).length : 0}</p>
      {user && (
        <button onClick={handleLike}>
          {post.likedBy && post.likedBy[user.uid] ? "Unlike" : "Like"}
        </button>
      )}
      </div>

      {user && (
        <div>
          <br/>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            rows="6" 
            cols="50" 
          />
          <br/>
          <button onClick={handleCommentSubmit}>Add a comment</button>
        </div>
      )}

      <h3>Comments</h3>
      {post.comments ? (
        Object.entries(post.comments).map(([commentId, commentData]) => (
          <div key={commentId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            {editingComment === commentId ? (
              <>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows="6" 
                  cols="50" 
                />{" "}
                <button onClick={() => handleSaveEdit(commentId)}>Save</button> {" "}
                <button onClick={() => setEditingComment(null)}>Close</button>
              </>
            ) : (
              <>
              <h6>User: {commentData.userHandle}{" "}| Date: {new Date(commentData.createdOn).toLocaleString()}</h6>
                <p>{commentData.text}</p>
                {user && user.uid === commentData.userId && (
                  <button
                    onClick={() =>
                      handleEditComment(commentId, commentData.text)
                    }
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}