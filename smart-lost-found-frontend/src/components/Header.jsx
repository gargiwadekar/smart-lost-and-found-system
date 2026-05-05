import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* LOGO */}
      <div className="header-logo" onClick={() => navigate("/")}>
        FindItNow
      </div>

      {/* NAV */}
      <nav className="menu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/how-to-use">How to Use</NavLink>
        <NavLink to="/about">About Us</NavLink>
      </nav>

      {/* AUTH */}
      <div className="auth-buttons">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="register-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </header>
  );
};

export default Header;
