import { useState, useEffect } from "react";
import { getTotalUsers } from "../../../services/user.services";

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    async function fetchTotalUsers() {
      const total = await getTotalUsers();
      setTotalUsers(total);
    }
    fetchTotalUsers();
  }, []);

  return (
    <div>
      <h2>Welcome to MindMerge Forum! </h2>
      <p>Register and join our {totalUsers} registered users and start sharing your experience with the world! </p>
    </div>
  );
}