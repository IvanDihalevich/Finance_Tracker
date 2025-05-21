import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/AuthContext";
import "../../css/AuthTile.css";

const Login: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const success = await authLogin(login, password);
      if (success) {
        navigate("/transaction");
      } else {
        setError("Failed to log in. Check your username or password.");
      }
    } catch (err) {
      setError("Error signing in. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="message">
          Not registered? <a href="/register">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
