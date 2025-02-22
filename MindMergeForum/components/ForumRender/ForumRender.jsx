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

    return (
        <div key={postId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", width: "600px" }}>
            {editingPost === postId ? (
                <>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Edit title"
                    />
                    <br/><br/>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Edit content"
                        rows="4"
                        cols="50"
                    />
                    {" "}
                    <button onClick={() => handleSaveEdit(postId)}>Save</button>{" "}
                    <button onClick={handleCancelEdit}>Cancel</button>
                </>
            ) : (
                <>
                    <h3>{post.title}</h3>
                    <h6>Created by: {userHandles[post.userId]} | Created on: {new Date(post.createdOn).toLocaleString()}</h6>
                    <p>{post.content}</p>
                    <p>❤️ {post.likedBy ? Object.keys(post.likedBy).length : 0} 💬 {post.comments ? Object.keys(post.comments).length : 0}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { navigate(`/posts/${postId}`) }}>See More</button>
                        {(auth.currentUser && auth.currentUser.uid === post.userId) || (userData && userData.role === Roles.admin) ? (
                            <>
                                <button onClick={() => handleDelete(postId)}>Delete</button>
                            </>
                        ) : null}
                        {(auth.currentUser && auth.currentUser.uid === post.userId) ? (
                            <>
                                <button onClick={() => handleEdit(postId, post.title, post.content)}>Edit</button>
                            </>
                        ) : null}
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