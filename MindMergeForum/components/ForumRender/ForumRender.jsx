import { useNavigate } from 'react-router-dom';
import { auth } from '../../src/config/firebase.config';
import { Roles } from '../../common/roles.enum';
import PropTypes from 'prop-types';

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
    const firstLetter = userHandles[post.userId]?.charAt(0).toLowerCase() || 'u';
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
                                {firstLetter.toUpperCase()}
                            </div>
                            <span className="author-name">{userHandles[post.userId]}</span>
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
    userHandles: PropTypes.object.isRequired,
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