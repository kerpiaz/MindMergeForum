import { useContext, useState } from "react";
import { loginUser } from "../../../services/auth.services";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app.context";
import { Roles } from "../../../common/roles.enum";
import { getUserData } from "../../../services/user.services";

export default function Login() {
  const { setAppState } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      const userData = await getUserData(user.uid);
      const userRole = userData[Object.keys(userData)[0]].role;

      setAppState({
        user,
        userData: userData[Object.keys(userData)[0]],
      });

      if (userRole === Roles.banned) {
        navigate("/banned");
      } else {
        navigate("/forum");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Log in</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br/> <br/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br/> <br/>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
