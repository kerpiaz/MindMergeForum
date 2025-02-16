
import { ref, push, get, set, remove, update } from "firebase/database";
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
    const snapshot = await get(ref(db, 'posts'))
    if(!snapshot.exists){
      return [];
    }
  
    const posts = Object.values(snapshot.val());

    return posts;
  
  };
  // export const likePost = async (postId, userId) => {
  //   const postRef = ref(db, `posts/${postId}`);
  //   const snapshot = await get(postRef);
  //   if (snapshot.exists()) {
  //     const post = snapshot.val();
  //     const likes = post.likes || [];
  //     if (likes.includes(userId)) {
  //       // Unlike the post
  //       const updatedLikes = likes.filter(id => id !== userId);
  //       await update(postRef, { likes: updatedLikes });
  //     } else {
  //       // Like the post
  //       const updatedLikes = [...likes, userId];
  //       await update(postRef, { likes: updatedLikes });
  //     }
  //   }
  // };

  //Will use these options for handling likes and unlikes as it is way simpler
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
    }
};