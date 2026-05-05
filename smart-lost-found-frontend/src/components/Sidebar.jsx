import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="logo">Lost & Found</h2>

      <NavLink to="/dashboard" end>
        🏠 Dashboard
      </NavLink>

      <NavLink to="/dashboard/found">
        ⭐ Found Entry
      </NavLink>

      <NavLink to="/dashboard/lost">
        🔍 Lost Inquiry
      </NavLink>

      <NavLink to="/dashboard/all">
        📋 All Entries
      </NavLink>

      <NavLink to="/dashboard/matching">
        🤝 Matching
      </NavLink>

      <NavLink to="/dashboard/stats">
        📊 Statistics
      </NavLink>
    </aside>
  );
};

export default Sidebar;
