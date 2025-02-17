import { useState, useEffect } from "react";
import { getTotalUsers } from "../../../services/user.services";
import { getPosts } from "../../../services/posts.services";

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchTotalUsersAndPosts() {
      const totalUsers = await getTotalUsers();
      setTotalUsers(totalUsers);
      const posts = await getPosts()
      const totalPosts = Object.keys(posts).length;
      setTotalPosts(totalPosts);
    }
    fetchTotalUsersAndPosts();
  }, []);

  return (
    <div>
      <h2>Welcome to MindMerge Forum! </h2>
      <p>Register and join our {totalUsers} registered users with more than {totalPosts} posts waiting for you and start sharing your experience with the world!</p>
    </div>
  );
}