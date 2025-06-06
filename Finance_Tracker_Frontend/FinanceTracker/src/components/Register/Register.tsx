import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../api/services/UserService";
import styles from "../../css/Login.module.css";

const Register: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await UserService.create({ login, password });
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as any;
        if (axiosError.response && axiosError.response.status === 409) {
          setError("User already exists.");
        } else {
          setError("Failed to register. Please try again.");
        }
      } else {
        setError("Unknown error. Please try again.");
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBackgroundSquares}>
        <div className={styles.registerSquare}></div>
        <div className={styles.registerSquare}></div>
        <div className={styles.registerSquare}></div>
        <div className={styles.registerSquare}></div>
      </div>

      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Registration</h2>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className={styles.registerInput}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.registerInput}
            required
          />
          <input
            type="password"
            placeholder="Password confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.registerInput}
            required
          />

          <button type="submit" className={styles.registerButton}>
          Sign up
          </button>

          {error && <p className={styles.registerError}>{error}</p>}

          <p className={styles.registerSwitch}>
          Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
