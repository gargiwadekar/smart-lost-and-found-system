import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ ADD THIS HERE
  const hideTopbarRoutes = [
    "/dashboard/found",
    "/dashboard/lost",
    "/dashboard/all",
    "/dashboard/matching",
    "/dashboard/stats"
  ];

  const hideTopbar = hideTopbarRoutes.includes(location.pathname);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        {/* ✅ Conditionally render Topbar */}
        {!hideTopbar && (
          <Topbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        )}

        <div className="dashboard-main">
          <Outlet context={{ searchTerm }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
