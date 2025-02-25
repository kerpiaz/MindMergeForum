import { useNavigate } from 'react-router-dom';
import { auth } from '../../src/config/firebase.config';
import { Roles } from '../../common/roles.enum';
import PropTypes from 'prop-types';

/**
 * Renders a forum post with editing capabilities
 * 
 * @param {Object} props - Component props
 * @param {string} props.postId - Unique identifier for the post
 * @param {Object} props.post - Post data
 * @param {string} props.post.title - Post title
 * @param {string} props.post.content - Post content
 * @param {string} props.post.userId - ID of user who created the post
 * @param {string|Date} props.post.createdOn - Post creation timestamp
 * @param {Object} [props.post.likedBy] - Object containing users who liked the post
 * @param {Object} [props.post.comments] - Object containing post comments
 * @param {Object} props.userHandles - Map of user IDs to user profile data
 * @param {string} [props.editingPost] - ID of post currently being edited
 * @param {string} props.editedTitle - Current value of title in edit mode
 * @param {string} props.editedContent - Current value of content in edit mode
 * @param {Function} props.setEditedTitle - Function to update edited title
 * @param {Function} props.setEditedContent - Function to update edited content
 * @param {Function} props.handleSaveEdit - Function to save post edits
 * @param {Function} props.handleCancelEdit - Function to cancel editing
 * @param {Function} props.handleEdit - Function to enter edit mode
 * @param {Function} props.handleDelete - Function to delete post
 * @param {Object} [props.userData] - Current user data
 * @param {string} [props.userData.role] - User role for permission checks
 * @returns {JSX.Element} Rendered forum post
 */
export default function ForumRender({
    postId,
    post,
    userHandles,
    editingPost,
    editedTitle,
    editedContent,
    setEditedTitle,
    setEditedContent,
    handleSaveEdit,
    handleCancelEdit,
    handleEdit,
    handleDelete,
    userData,
}) {
    const navigate = useNavigate();
    const userProfile = userHandles[post.userId] || {};
    const firstLetter = userProfile.handle?.charAt(0).toLowerCase() || 'u';
    const avatarClass = `author-avatar avatar-${firstLetter}`;

    return (
        <div className="post-item">
            {editingPost === postId ? (
                <div className="post-content">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Edit title"
                        className="post-title"
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Edit content"
                        rows="4"
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    <div className="post-actions">
                        <button className="action-button edit" onClick={() => handleSaveEdit(postId)}>Save</button>
                        <button className="action-button delete" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="post-header">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-author">
                            <div className={avatarClass}>
                                {userProfile.profilePicture ? (
                                    <img 
                                        src={userProfile.profilePicture} 
                                        alt={userProfile.handle} 
                                        className="profile-picture"
                                    />
                                ) : (
                                    <span>{firstLetter.toUpperCase()}</span>
                                )}
                            </div>
                            <span className="author-name">{userProfile.handle}</span>
                        </div>
                    </div>
                    
                    <div className="post-content">
                        <p>{post.content}</p>
                    </div>

                    <div className="post-footer">
                        <div className="post-actions">
                            <button className="action-button see-more" onClick={() => { navigate(`/posts/${postId}`) }}>
                                See More
                            </button>
                            {(auth.currentUser && auth.currentUser.uid === post.userId) && (
                                <button className="action-button edit" onClick={() => handleEdit(postId, post.title, post.content)}>
                                    Edit
                                </button>
                            )}
                            {((auth.currentUser && auth.currentUser.uid === post.userId) || (userData && userData.role === Roles.admin)) && (
                                <button className="action-button delete" onClick={() => handleDelete(postId)}>
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="post-meta">
                            <span className="comment-count">
                                ❤️ {post.likedBy ? Object.keys(post.likedBy).length : 0}
                            </span>
                            <span className="comment-count">
                                💬 {post.comments ? Object.keys(post.comments).length : 0}
                            </span>
                            <span>{new Date(post.createdOn).toLocaleString()}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

ForumRender.propTypes = {
    postId: PropTypes.string.isRequired,
    post: PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        createdOn: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        likedBy: PropTypes.object,
        comments: PropTypes.object,
    }).isRequired,
    userHandles: PropTypes.objectOf(PropTypes.shape({
        handle: PropTypes.string.isRequired,
        profilePicture: PropTypes.string
    })).isRequired,
    editingPost: PropTypes.string,
    editedTitle: PropTypes.string.isRequired,
    editedContent: PropTypes.string.isRequired,
    setEditedTitle: PropTypes.func.isRequired,
    setEditedContent: PropTypes.func.isRequired,
    handleSaveEdit: PropTypes.func.isRequired,
    handleCancelEdit: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    userData: PropTypes.shape({
        role: PropTypes.string,
    }),
};