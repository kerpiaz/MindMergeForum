import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../src/store/app.context";
import { ref, onValue, update, push } from "firebase/database";
import { db } from "../../src/config/firebase.config";
import { getUserById } from "../../services/user.services";
import { processTextWithLLM } from "../../services/llm.service.js";
import "./Post.css";
import { remove } from "firebase/database";

export default function Post() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [postCreatorHandle, setPostCreatorHandle] = useState("");
  const [postCreatorProfile, setPostCreatorProfile] = useState(null);
  const [commentUserProfiles, setCommentUserProfiles] = useState({});
  const [llmResult, setLlmResult] = useState(null);
  const [isLlmLoading, setIsLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState(null);

 /**
 * Fetches post data and related user profiles
 * 
 * @effect Subscribes to real-time post updates, loads post creator profile
 *         and all commenter profiles, cleans up subscription on unmount
 */
  useEffect(() => {
    const postRef = ref(db, `posts/${id}`);
    const unsubscribe = onValue(
      postRef,
      async (snapshot) => {
        const postData = snapshot.val();
        if (postData) {
          setPost(postData);
          const userData = await getUserById(postData.userId);
          if (userData) {
            setPostCreatorHandle(userData.handle);
            setPostCreatorProfile(userData.profilePicture);
          }

          if (postData.comments) {
            const profiles = {};
            await Promise.all(
              Object.values(postData.comments).map(async (comment) => {
                const commenterData = await getUserById(comment.userId);
                if (commenterData) {
                  profiles[comment.userId] = {
                    handle: commenterData.handle,
                    profilePicture: commenterData.profilePicture
                  };
                }
              })
            );
            setCommentUserProfiles(profiles);
          }
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

/**
 * Fetches current user's handle when authenticated
 * 
 * @effect Loads the current user's handle when user auth state is available
 */
  useEffect(() => {
    if (user) {
      getUserById(user.uid).then((userData) => {
        if (userData) {
          setUserHandle(userData.handle);
        }
      });
    }
  }, [user]);

 /**
 * Conditional rendering for loading state
 * 
 * @returns {JSX.Element} Loading indicator when post data is not yet available
 */
  if (!post) return <div className="loading">Loading...</div>;

/**
 * Toggles like status for the current post
 * 
 * Adds or removes current user's ID from post's likedBy object
 * Updates database and local state accordingly
 */
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

/**
 * Submits a new comment to the current post
 * 
 * Validates input, creates comment object with user data and timestamp,
 * pushes to database, and clears input field on success
 */
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

/**
 * Initiates comment editing mode
 * 
 * @param {string} commentId - ID of comment to edit
 * @param {string} currentText - Current text content of the comment
 */
  const handleEditComment = (commentId, currentText) => {
    setEditingComment(commentId);
    setEditedText(currentText);
  };

/**
 * Saves edited comment text to database
 * 
 * @param {string} commentId - ID of comment being edited
 */
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
  

    /**
     * Deletes a comment from the database.
     *
     * @param {string} commentId - The ID of the comment to be deleted.
     * @returns {void}
     */
    const handleDeleteComment = (commentId) => {
        if (!user) return;

    const commentRef = ref(db, `posts/${id}/comments/${commentId}`);
    remove(commentRef)
        .then(() => {
        console.log("The comment was successfully deleted.");
        })
        .catch((error) => {
      console.error("Error deleting a comment:", error.message);
        });
    };


  return (
    <div className="post-details-container">
      <div className="post-card">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
        </div>
        
        <div className="post-meta">
          <div className="author-avatar">
            {postCreatorProfile ? (
              <img 
                src={postCreatorProfile} 
                alt={postCreatorHandle} 
                className="profile-picture"
              />
            ) : (
              <span>{postCreatorHandle?.[0]?.toUpperCase() || '?'}</span>
            )}
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
          {user && (
            <div className="llm-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                className="llm-action-button"
                onClick={() => handleLlmAction('summarize')}
                disabled={isLlmLoading}
              >
                Summarize
              </button>
              <button
                className="llm-action-button"
                onClick={() => handleLlmAction('explain')}
                disabled={isLlmLoading}
              >
                Explain
              </button>
              <button
                className="llm-action-button"
                onClick={() => handleLlmAction('search')}
                disabled={isLlmLoading}
              >
                Search (LLM)
              </button>
            </div>
          )}
          {isLlmLoading && <div className="llm-loading-message">Processing with LLM...</div>}
          {llmError && <div className="llm-error-message" style={{ color: 'red', marginTop: '10px' }}>Error: {llmError}</div>}
          {llmResult && (
            <div className="llm-result-container" style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
              <h4>LLM Result:</h4>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{llmResult}</pre>
              <button onClick={() => { setLlmResult(null); setLlmError(null); }} style={{ marginTop: '10px' }}>
                Clear Result
              </button>
            </div>
          )}
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
          Object.entries(post.comments).map(([commentId, commentData]) => {
            const userProfile = commentUserProfiles[commentData.userId];
            return (
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
                      <div className="author-avatar">
                        {userProfile?.profilePicture ? (
                          <img
                            src={userProfile.profilePicture}
                            alt={commentData.userHandle}
                            className="profile-picture"
                          />
                        ) : (
                          <span>
                            {commentData.userHandle?.[0]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      <span className="author-name">
                        {commentData.userHandle}
                      </span>
                      <div className="post-date-info">
                        <span className="date-separator">•</span>
                        <span>
                          {new Date(commentData.createdOn).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="post-content">
                      <p>{commentData.text}</p>
                      {user && user.uid === commentData.userId && (
                        <div className="comment-actions">
                          <button
                            className="submit-answer-button"
                            onClick={() =>
                              handleEditComment(commentId, commentData.text)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="submit-answer-button delete-button"
                            onClick={() => handleDeleteComment(commentId)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-answers-message">No comments yet.</p>
        )}
      </div>
    </div>
  );
}