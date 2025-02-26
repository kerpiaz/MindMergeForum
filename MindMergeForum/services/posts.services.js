import { ref, push, get, remove, update } from "firebase/database";
import { db } from "../src/config/firebase.config";

/**
 * Creates a new post in the database
 * 
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @param {string} userId - ID of user creating the post
 * @returns {Promise} Firebase database promise
 */
export const createPost = async (title, content, userId) => {
    try {
      const postsRef = ref(db, "posts");
      await push(postsRef, {
        title,
        content,
        userId,
        likes: 0,
        comments: [],
        createdOn: new Date().toString(),
      });
      console.log("The post was created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

/**
 * Retrieves all posts from the database
 * 
 * @returns {Promise<Object>} Object containing all posts
 */
  export const getPosts = async () => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists) {
      return {};
    }
  
    return snapshot.val();
  };

/**
 * Adds user like to a post
 * 
 * @param {string} handle - User handle
 * @param {string} postId - ID of post to like
 * @returns {Promise} Firebase update promise
 */
  export const likePost = async(handle, postId) =>{
    const updatedPost =  {
      [`posts/${postId}/likedBy/${handle}`]:true,
      [`users/${handle}/likedPosts/${postId}`]:true,
    }
  
    return update(ref(db), updatedPost)
  }

/**
 * Removes user like from a post
 * 
 * @param {string} handle - User handle
 * @param {string} postId - ID of post to unlike
 * @returns {Promise} Firebase update promise
 */
  export const unlikePost = async(handle, postId) =>{
    const updatedPost =  {
      [`posts/${postId}/likedBy/${handle}`]:null,
      [`users/${handle}/likedPosts/${postId}`]:null,
    }
  
    return update(ref(db), updatedPost)
  }

/**
 * Deletes a post from the database
 * 
 * @param {string} postId - ID of post to delete
 * @returns {Promise} Firebase remove promise
 */
  export const deletePost = async (postId) => {
    try {
      await remove(ref(db, `posts/${postId}`));
      console.log("The post was deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

/**
 * Updates post data in the database
 * 
 * @param {string} postId - ID of post to update
 * @param {Object} updatedData - New post data
 * @returns {Promise} Firebase update promise
 */
  export const updatePost = async (postId, updatedData) => {
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, updatedData);
  };

/**
 * Searches posts by title
 * 
 * @param {string} search - Search query
 * @returns {Promise<Array>} Filtered posts matching search term
 */
  export const getPostsByTitle = async (search = '') => {
    const snapshot = await get(ref(db, 'posts'));
    if (snapshot.exists()) {
      if (search) {
        const posts = Object.values(snapshot.val());
        // Create a case-insensitive RegExp that will work with any Unicode character including Cyrillic
        const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu');
        return posts.filter(post => searchRegex.test(post.title));
      }
      return Object.values(snapshot.val());
    }
    return {};
  };

/**
 * Searches posts by content
 * 
 * @param {string} search - Search query
 * @returns {Promise<Array>} Filtered posts matching search term
 */
  export const getPostsByContent = async (search = '') => {
    const snapshot = await get(ref(db, 'posts'));
    if (snapshot.exists()) {
      if (search) {
        const posts = Object.values(snapshot.val());
        // Create a case-insensitive RegExp that will work with any Unicode character including Cyrillic
        const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu');
        return posts.filter(post => searchRegex.test(post.content));
      }
      return Object.values(snapshot.val());
    }
    return {};
  };