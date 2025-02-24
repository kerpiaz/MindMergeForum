import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../../services/posts.services";
import { auth } from "../../config/firebase.config";
import "./CreatePost.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (title.length < 16 || title.length > 64) {
      setError("The title must be between 16 and 64 characters!");
      return;
    }
    if (content.length < 32 || content.length > 8192) {
      setError("The content must be between 32 and 8192 characters!");
      return;
    }

    try {
      await createPost(title, content, auth.currentUser.uid);
      navigate("/forum");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="page-title">Create New Post</h2>
      <p className="page-description">
        Share your thoughts, questions, or insights with the community.
      </p>

      <div className="guidelines-card">
        <h3 className="guidelines-title">Posting Guidelines</h3>
        <div className="guidelines-list">
          <div className="guideline-item">
            <span className="guideline-icon">✓</span>
            <span className="guideline-text">
              Title should be clear and descriptive (16-64 characters)
            </span>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">✓</span>
            <span className="guideline-text">
              Content should be detailed and well-explained (32-8192 characters)
            </span>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">✓</span>
            <span className="guideline-text">
              Be respectful and constructive in your writing
            </span>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">✓</span>
            <span className="guideline-text">
              Check for similar posts before creating a new one
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleCreatePost}>
        <div className="form-section">
          <label className="form-label">
            Title
            <span className="required-marker">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="character-counter">
            {title.length}/64 characters
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">
            Content
            <span className="required-marker">*</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="character-counter">
            {content.length}/8192 characters
          </div>
        </div>

        <button type="submit" className="submit-button">
          Create Post
        </button>
      </form>
    </div>
  );
}
