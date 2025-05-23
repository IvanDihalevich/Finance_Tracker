import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/AuthContext";
import styles from "../../css/Login.module.css";

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
        setError("Неправильний логін або пароль.");
      }
    } catch {
      setError("Помилка під час входу.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        <i className={styles.ringLayer}></i>
        <i className={styles.ringLayer}></i>
        <i className={styles.ringLayer}></i>

        <div className={styles.formContainer}>
          <h2 className={styles.title}>Login</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input type="submit" value="Sign in" />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.linkGroup}>
              <a href="#">Забули пароль?</a>
              <a href="/register">Зареєструватися</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
