
import { ref, push, get, set, remove } from "firebase/database";
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
        createdAt: Date.now()
      });
      console.log("The post was created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  export const getPosts = async () => {
    const snapshot = await get(ref(db, "posts"));
    return snapshot.exists() ? snapshot.val() : {};
  };
  export const likePost = async (postId, currentLikes) => {
    try {
      const postRef = ref(db, `posts/${postId}/likes`);
      await set(postRef, currentLikes + 1);
      console.log("The post was liked successfully!");
    } catch (error) {
      console.error("Error like post:", error);
    }
  };
export const deletePost = async (postId) => {
    try {
        await remove(ref(db, `posts/${postId}`));
        console.log("The post was deleted successfully!");
    } catch (error) {
        console.error("Error deleting post:", error);
    }
};