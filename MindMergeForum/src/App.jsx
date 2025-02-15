import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Forum from "./pages/Forum/Forum";
import CreatePost from "./pages/CreatePost/CreatePost";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/forum" style={{ marginRight: "10px" }}>Forum</Link>
        <Link to="/create-post" style={{ marginRight: "10px" }}>Create post</Link>
        <Link to="/login" style={{ marginRight: "10px" }}>Log in</Link>
        <Link to="/register" style={{ marginRight: "10px" }}>Sign up</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
