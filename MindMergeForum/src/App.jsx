import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import Forum from "./pages/Forum/Forum";
import CreatePost from "./pages/CreatePost/CreatePost";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Authenticated from "../hoc/Authenticated";
import { AppContext } from './store/app.context';
import Header from '../components/Header/Header';
import { useState, useEffect } from "react";
import { auth } from './config/firebase.config';
import { getUserData } from '../services/user.services';
import NotFound from '../components/NotFound/NotFound';
import { useAuthState } from 'react-firebase-hooks/auth';
import Profile from '../components/Profile/Profile';
import Post from '../components/Post/Post';
import './App.css';
import BannedUser from "../components/BannedUser/BannedUser";
import AdminTools from "./pages/AdminTools/AdminTools";
import PasswordChange from '../components/PasswordChange/PasswordChange'

/**
 * Main application component
 * 
 * Manages global authentication state and user data
 * 
 * @returns {JSX.Element} Application with routing
 */
function App() {

  const [appState, setAppState] = useState({
    user: null,
    userData: null
  })

  const [user] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState(prevState => ({ ...prevState, user }));
    }
  }, [user, appState.user, setAppState]);

  useEffect(() => {
    if (!user) {
      return;
    }

    /**
     * Fetches user data when authentication state changes
     *
     * @effect Retrieves and stores user profile data when user authenticates
     */
    getUserData(user?.uid)
    .then((data) => {
      if (data && Object.keys(data).length > 0) {
        const userData = data[Object.keys(data)[0]];
        setAppState(prevState => ({ ...prevState, userData }));
      } else {
        setAppState(prevState => ({ ...prevState, userData: null }));
      }
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
      setAppState(prevState => ({ ...prevState, userData: null }));
    });
  }, [user, setAppState]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={useMemo(() => ({ ...appState, setAppState }), [appState])}>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/create-post" element={<Authenticated><CreatePost /></Authenticated>} />
          <Route path="/posts/:id" element={<Authenticated><Post /></Authenticated>} />
          <Route path="/user-profile" element={<Authenticated><Profile /></Authenticated>} />
          <Route path="/admin-tools" element={<Authenticated><AdminTools /></Authenticated>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/banned" element={<Authenticated><BannedUser /></Authenticated>} />
          <Route path="/password-change" element={<Authenticated><PasswordChange /></Authenticated>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
