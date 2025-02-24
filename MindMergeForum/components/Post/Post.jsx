import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../src/store/app.context";
import { ref, onValue, update, push } from "firebase/database";
import { db } from "../../src/config/firebase.config";
import { getUserById } from "../../services/user.services";
import "./Post.css";

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
    return <div className="post-details-container">Loading...</div>;
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

    push(commentsRef, newComment)
      .then(() => {
        setComment("");
      })
      .catch((error) => {
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
    update(commentRef, { text: editedText })
      .then(() => {
        setEditingComment(null);
        setEditedText("");
      })
      .catch((error) => {
        console.error("Error saving comment:", error.message);
      });
  };

  const firstLetter = postCreatorHandle.charAt(0).toLowerCase();

  return (
    <div className="post-details-container">
      <div className="post-card">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
        </div>
        
        <div className="post-meta">
          <div className={`author-avatar avatar-${firstLetter}`}>
            {firstLetter.toUpperCase()}
          </div>
          <span className="author-name">{postCreatorHandle}</span>
          <div className="post-date-info">
            <span className="date-separator">•</span>
            <span>{new Date(post.createdOn).toLocaleString()}</span>
          </div>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
          <div className="post-icons">
            <div className="icon-group">
              <span>❤️</span>
              <span>{post.likedBy ? Object.keys(post.likedBy).length : 0}</span>
            </div>
            <div className="icon-group">
              <span>💬</span>
              <span>{post.comments ? Object.keys(post.comments).length : 0}</span>
            </div>
            {user && (
              <button 
                className="submit-answer-button" 
                onClick={handleLike}
              >
                {post.likedBy && post.likedBy[user.uid] ? "Unlike" : "Like"}
              </button>
            )}
          </div>
        </div>
      </div>

      {user && (
        <div className="answer-section">
          <h3 className="answer-header">Add a Comment</h3>
          <div className="answer-form">
            <textarea
              className="answer-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
            />
            <button 
              className="submit-answer-button"
              onClick={handleCommentSubmit}
            >
              Add Comment
            </button>
          </div>
        </div>
      )}

      <div className="answers-container">
        <div className="answers-header">
          <h3 className="answers-count">
            Comments ({post.comments ? Object.keys(post.comments).length : 0})
          </h3>
        </div>

        {post.comments ? (
          Object.entries(post.comments).map(([commentId, commentData]) => (
            <div key={commentId} className="post-card">
              {editingComment === commentId ? (
                <div className="answer-form">
                  <textarea
                    className="answer-textarea"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <div className="post-actions">
                    <button 
                      className="submit-answer-button"
                      onClick={() => handleSaveEdit(commentId)}
                    >
                      Save
                    </button>
                    <button 
                      className="submit-answer-button"
                      onClick={() => setEditingComment(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="post-meta">
                    <div className={`author-avatar avatar-${commentData.userHandle.charAt(0).toLowerCase()}`}>
                      {commentData.userHandle.charAt(0).toUpperCase()}
                    </div>
                    <span className="author-name">{commentData.userHandle}</span>
                    <div className="post-date-info">
                      <span className="date-separator">•</span>
                      <span>{new Date(commentData.createdOn).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{commentData.text}</p>
                    {user && user.uid === commentData.userId && (
                      <button
                        className="submit-answer-button"
                        onClick={() => handleEditComment(commentId, commentData.text)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-answers-message">No comments yet.</p>
        )}
      </div>
    </div>
  );
}