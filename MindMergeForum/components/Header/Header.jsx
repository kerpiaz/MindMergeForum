import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../src/store/app.context";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.services";
import { Roles } from "../../common/roles.enum";
import styles from './Header.module.css';  // Updated to use CSS Module

/**
 * Header component that displays navigation based on user authentication and role
 * 
 * Renders different navigation options depending on:
 * - Whether user is logged in
 * - User's role (admin, regular user, or banned)
 * 
 * Banned users see only the logo and logout button
 * Admin users see all navigation options including admin tools
 * Regular users see standard navigation without admin tools
 * Non-authenticated users see only login and register options
 * 
 * @returns {JSX.Element} Header component with conditional navigation
 */
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
        <h1 className={styles.logo}>MindMerge Forum</h1>
        <div className={styles.userSection}>
          {user && <button className={styles.logoutBtn} onClick={logout}>Log Out</button>}
        </div>
      </header>
    );
  }

  const baseLinks = [
    { to: "/forum", text: "Forum" },
    { to: "/user-profile", text: "My Profile" },
    { to: "/create-post", text: "Create Post" },
  ];

  return (
    <header className="navbar">
      <h1 className="logo">MindMerge Forum</h1>
      <nav className={styles.navLinks}>
        {user && userData ? (
          <>
            <NavLink to="/" className={styles.navLink}>Home</NavLink>
            {userData.role === Roles.admin && (
              <NavLink to="/admin-tools" className={styles.navLink}>Admin Tools</NavLink>
            )}
            {baseLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={styles.navLink}>{link.text}</NavLink>
            ))}
          </>
        ) : (
          <>
            <NavLink to="/login" className={styles.navLink}>Log in</NavLink>
            <NavLink to="/register" className={styles.navLink}>Register</NavLink>
          </>
        )}
      </nav>
      <div className={styles.userSection}>
        {userData && <span className={styles.welcomeText}>Welcome, {userData.handle}</span>}
        {user && <button className={styles.logoutBtn} onClick={logout}>Log Out</button>}
      </div>
    </header>
  );
}