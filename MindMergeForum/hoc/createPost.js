export const createPost = async (title, content, userId) => {
    try {
      const postsRef = ref(database, "posts");
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
      console.error("Post creation error:", error);
    }
  };
 
  export const getPosts = async () => {
    const snapshot = await get(ref(database, "posts"));
    return snapshot.exists() ? snapshot.val() : {};
  };

  export const likePost = async (postId, currentLikes) => {
    const postRef = ref(database, `posts/${postId}/likes`);
    return update(postRef, { ".value": currentLikes + 1 });
  };
  
  export const deletePost = async (postId) => {
    return remove(ref(database, `posts/${postId}`));
  };

