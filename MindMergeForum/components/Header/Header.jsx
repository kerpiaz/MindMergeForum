import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../src/store/app.context";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.services";
import { Roles } from "../../common/roles.enum";
import './Header.css';

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext)
  const navigate = useNavigate();

  const logout = () => {
    logoutUser()
      .then(() => {
        setAppState({
          user: null,
          userData: null,
        });
        navigate('/')
      })
      .catch((error) => console.error(error.message))
  }

  if (userData?.role === Roles.banned) {
    return (
      <header className="navbar">
        <h1 className="logo">MindMerge Forum</h1>
        <div className="user-section">
          {user && <button className="logout-btn" onClick={logout}>Log Out</button>}
        </div>
      </header>
    );
  }

  return (
    <header className="navbar">
      <h1 className="logo">MindMerge Forum</h1>
      <nav className="nav-links">
        <NavLink to="/" className="nav-link">Home</NavLink>
        {user && userData && userData.role === Roles.admin && (
          <>
            <NavLink to="/forum" className="nav-link">Forum</NavLink>
            <NavLink to="/user-profile" className="nav-link">My Profile</NavLink>
            <NavLink to="/create-post" className="nav-link">Create Post</NavLink>
            <NavLink to="/admin-tools" className="nav-link">Admin Tools</NavLink>
          </>
        )}
        {user && userData && userData.role === Roles.user && (
          <>
            <NavLink to="/forum" className="nav-link">Forum</NavLink>
            <NavLink to="/user-profile" className="nav-link">My Profile</NavLink>
            <NavLink to="/create-post" className="nav-link">Create Post</NavLink>
          </>
        )}
        {!user && <NavLink to="/login" className="nav-link">Log in</NavLink>}
        {!user && <NavLink to="/register" className="nav-link">Register</NavLink>}
      </nav>
      <div className="user-section">
        {userData && <span className="welcome-text">Welcome, {userData.handle}</span>}
        {user && <button className="logout-btn" onClick={logout}>Log Out</button>}
      </div>
    </header>
  );
}