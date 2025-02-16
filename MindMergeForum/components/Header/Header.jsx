import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../src/store/app.context";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.services";

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

  return (
    <header>
      <h1>MindMerge Forum</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        {user && (
          <>
            <NavLink to="/forum">Forum</NavLink>
            <NavLink to="/user-profile">My Profile</NavLink>
            <NavLink to="/create-post">Create Post</NavLink>
          </>
        )}
        {!user && <NavLink to="/login">Log in</NavLink>}
        {!user && <NavLink to="/register">Register</NavLink>}
      </nav>
      {user && <button onClick={logout}>Log Out</button>}
      {userData && <span> Welcome, {userData.handle}</span>}
    </header>
  );
}