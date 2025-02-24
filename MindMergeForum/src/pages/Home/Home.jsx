import { useState, useEffect } from "react";
import { getTotalUsers } from "../../../services/user.services";
import { getPosts } from "../../../services/posts.services";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchTotalUsersAndPosts() {
      const totalUsers = await getTotalUsers();
      setTotalUsers(totalUsers);
      const posts = await getPosts()
      const totalPosts = posts ? Object.keys(posts).length : 0;
      setTotalPosts(totalPosts);
    }
    fetchTotalUsersAndPosts();
  }, []);

  return (
    <div className="main-container">
      <section className="hero-section">
        <h2 className="hero-title">Welcome to MindMerge Forum!</h2>
        <p className="hero-subtitle">Join our community of thinkers, creators, and innovators</p>
        <div className="button-container">
          <Link to="/register" className="primary-button">Get Started</Link>
          <Link to="/forum" className="secondary-button">Browse Forum</Link>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalUsers}</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalPosts}</div>
            <div className="stat-label">Engaging Posts</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h3 className="features-title">Why Join MindMerge?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4 className="feature-title">Connect</h4>
            <p className="feature-description">
              Connect with like-minded individuals and expand your network
            </p>
          </div>
          <div className="feature-card">
            <h4 className="feature-title">Share</h4>
            <p className="feature-description">
              Share your knowledge and experiences with the community
            </p>
          </div>
          <div className="feature-card">
            <h4 className="feature-title">Grow</h4>
            <p className="feature-description">
              Learn from others and grow your skills through meaningful discussions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}