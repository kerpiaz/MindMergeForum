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

function App() {

  const [appState, setAppState] = useState({
    user: null,
    userData: null
  }) //here we use useState because it sets the global state. Other components will use useContext to access it

  const [user, loading, error] = useAuthState(auth);

  if(appState.user !== user){
    setAppState({
      ...appState,
      user,
    })
  }

  useEffect(()=>{
    if(!user){
      return;
    }
    getUserData(appState.user?.uid)
    .then((data)=>{
      const userData = data[Object.keys(data)[0]];
      setAppState({
        ...appState,
        userData,
      })
    })
  }, [user])

  return (
    <BrowserRouter>
      <AppContext.Provider value = {{...appState, setAppState}}> 
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/create-post" element={<Authenticated><CreatePost /></Authenticated>} />
          <Route path="/posts/:id" element={<Authenticated><Post /></Authenticated>} />
          <Route path="/user-profile" element={<Authenticated><Profile /></Authenticated>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer>&copy;2025</footer>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
