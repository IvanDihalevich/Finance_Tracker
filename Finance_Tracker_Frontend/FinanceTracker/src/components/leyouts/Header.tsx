import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../api/services/AuthService";
import styles from "../../css/Header.module.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/transaction":
        return "Your Transactions";
      case "/statistic":
        return "Your Statistics";
      case "/category":
        return "Category Overview";
      default:
        return "Welcome to FinanceTracker";
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerDarkContainer}>
          <h1 className={styles.headerDarkLogo}>Finvisor</h1>

          <ul className={styles.headerDarkNavItems}>
            {AuthService.isAuthenticated() && (
              <>
                <li><Link to="/transaction">Transactions</Link></li>
                <li><Link to="/category">Categories</Link></li>
                <li><Link to="/statistic">Statistics</Link></li>
              </>
            )}
          </ul>

          <ul className={styles.headerDarkAuthLinks}>
            {AuthService.isAuthenticated() ? (
              <li>
                <Link to="/login" onClick={handleLogout}>Logout</Link>
              </li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </header>

      <header className={styles.headerDarkBanner}>
        <div className={styles.headerDarkTitle}>
          <h1>{getHeaderTitle()}</h1>
        </div>
      </header>
    </>
  );
};

export default Header;
