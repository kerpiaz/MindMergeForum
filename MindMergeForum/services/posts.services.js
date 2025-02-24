import { ref, push, get, remove, update } from "firebase/database";
import { db } from "../src/config/firebase.config";

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
  export const getPosts = async () => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists) {
      return {};
    }
  
    return snapshot.val();
  };

  export const likePost = async(handle, postId) =>{
    const updatedPost =  {
      [`posts/${postId}/likedBy/${handle}`]:true,
      [`users/${handle}/likedPosts/${postId}`]:true,
    }
  
    return update(ref(db), updatedPost)
  }
  
  export const unlikePost = async(handle, postId) =>{
    const updatedPost =  {
      [`posts/${postId}/likedBy/${handle}`]:null,
      [`users/${handle}/likedPosts/${postId}`]:null,
    }
  
    return update(ref(db), updatedPost)
  }

  export const deletePost = async (postId) => {
    try {
      await remove(ref(db, `posts/${postId}`));
      console.log("The post was deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  export const updatePost = async (postId, updatedData) => {
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, updatedData);
  };

  export const getPostsByTitle = async (search = '') => {
    const snapshot = await get(ref(db, 'posts'));
    if (snapshot.exists()) {
      if (search) {
        const posts = Object.values(snapshot.val());
        return posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()));
      }
      return Object.values(snapshot.val());
    }
    return {};
  };
  
  export const getPostsByContent = async (search = '') => {
    const snapshot = await get(ref(db, 'posts'));
    if (snapshot.exists()) {
      if (search) {
        const posts = Object.values(snapshot.val());
        return posts.filter(post => post.content.toLowerCase().includes(search.toLowerCase()));
      }
      return Object.values(snapshot.val());
    }
    return {};
  };