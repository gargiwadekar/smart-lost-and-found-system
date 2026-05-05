import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Topbar = ({ searchTerm = "", onSearchChange = () => {} }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <input
        className="search"
        placeholder="Search lost and found items..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="user-area">
        <div
          className="user-info-box"
          onClick={() => navigate("/profile")}
          role="button"
          tabIndex="0"
        >
          <div className="avatar">
            {user?.name?.charAt(0)}
          </div>
          <span className="username">{user?.name}</span>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
