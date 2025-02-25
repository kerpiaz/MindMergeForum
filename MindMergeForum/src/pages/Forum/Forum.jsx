import { useState, useEffect, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access URL parameters
import { getPosts, deletePost, updatePost, getPostsByTitle, getPostsByContent } from "../../../services/posts.services";
import { getUserById } from "../../../services/user.services";
import { AppContext } from "../../store/app.context";
import ForumRender from "../../../components/ForumRender/ForumRender";
import "./Forum.css";

/**
 * Forum component displaying posts with search and sort functionality
 * 
 * @returns {JSX.Element} Forum page with posts and controls
 */
export default function Forum() {
  const { userData } = useContext(AppContext);
  const location = useLocation(); // Initialize useLocation hook
  
  const [posts, setPosts] = useState({});
  const [userHandles, setUserHandles] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [sortCriteria, setSortCriteria] = useState("uploadDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");

/**
 * Extracts and applies search parameters from URL
 * 
 * @effect Sets search state based on URL query parameters
 */
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryFromURL = queryParams.get("searchQuery");
    const criteriaFromURL = queryParams.get("searchCriteria");
    
    if (queryFromURL) {
      setSearchQuery(queryFromURL);
    }
    
    if (criteriaFromURL) {
      setSearchCriteria(criteriaFromURL);
    }
  }, [location]);

/**
 * Fetches posts and user data based on search criteria
 * 
 * @effect Loads posts filtered by search query and criteria
 *         Retrieves user handles for post authors
 */
  useEffect(() => {
    const fetchPostsAndHandles = async () => {
      try {
        let data;
        if (searchQuery) {
          if (searchCriteria === "title") {
            data = await getPostsByTitle(searchQuery);
          } else {
            data = await getPostsByContent(searchQuery);
          }
        } else {
          data = await getPosts();
        }
        setPosts(data || {});

        const handles = {};
        for (const postId in data) {
          const post = data[postId];
          const userData = await getUserById(post.userId);
          handles[post.userId] = {
            handle: userData ? userData.handle : "Unknown User",
            profilePicture: userData ? userData.profilePicture : null
          };
        }
        setUserHandles(handles);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPostsAndHandles();
  }, [searchQuery, searchCriteria]);

/**
 * Sorts posts based on selected criteria and direction
 * 
 * @returns {Array} Sorted array of posts
 */
  const sortedPosts = useMemo(() => {
    const postsArray = Object.entries(posts);
    const sortModifier = sortDirection === 'asc' ? 1 : -1;
  
    if (sortCriteria === 'comments') {
      return [...postsArray].sort((a, b) => {
        const aCount = a[1].comments ? Object.keys(a[1].comments).length : 0;
        const bCount = b[1].comments ? Object.keys(b[1].comments).length : 0;
        return (bCount - aCount) * sortModifier;
      });
    }
  
    return [...postsArray].sort((a, b) => {
      const aDate = new Date(a[1].createdOn);
      const bDate = new Date(b[1].createdOn);
      return (bDate - aDate) * sortModifier;
    });
  }, [posts, sortCriteria, sortDirection]);

/**
 * Deletes a post and updates state
 * 
 * @param {string} postId - ID of post to delete
 */
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

/**
 * Initiates post editing mode
 * 
 * @param {string} postId - ID of post to edit
 * @param {string} title - Current post title
 * @param {string} content - Current post content
 */
  const handleEdit = (postId, title, content) => {
    setEditingPost(postId);
    setEditedTitle(title);
    setEditedContent(content);
  };

/**
 * Saves edited post to database and updates state
 * 
 * @param {string} postId - ID of post being edited
 */
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

/**
 * Cancels post editing mode
 */
  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h2 className="forum-title">Forum</h2>
      </div>
      <div className="filter-controls">
        <div className="filter-group">
          <span className="filter-label">Search by:</span>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                name="searchCriteria"
                value="title"
                checked={searchCriteria === "title"}
                onChange={(e) => setSearchCriteria(e.target.value)}
                id="search-title"
              />
              <label htmlFor="search-title">Title</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                name="searchCriteria"
                value="content"
                checked={searchCriteria === "content"}
                onChange={(e) => setSearchCriteria(e.target.value)}
                id="search-content"
              />
              <label htmlFor="search-content">Content</label>
            </div>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Sort by:</span>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                name="criteria"
                value="comments"
                checked={sortCriteria === "comments"}
                onChange={(e) => setSortCriteria(e.target.value)}
                id="sort-comments"
              />
              <label htmlFor="sort-comments">Comments</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                name="criteria"
                value="uploadDate"
                checked={sortCriteria === "uploadDate"}
                onChange={(e) => setSortCriteria(e.target.value)}
                id="sort-date"
              />
              <label htmlFor="sort-date">Date</label>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Order:</span>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                name="direction"
                value="asc"
                checked={sortDirection === "asc"}
                onChange={(e) => setSortDirection(e.target.value)}
                id="order-asc"
              />
              <label htmlFor="order-asc">Ascending</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                name="direction"
                value="desc"
                checked={sortDirection === "desc"}
                onChange={(e) => setSortDirection(e.target.value)}
                id="order-desc"
              />
              <label htmlFor="order-desc">Descending</label>
            </div>
          </div>
        </div>
      </div>

      {sortedPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        sortedPosts.map(([postId, post]) => (
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