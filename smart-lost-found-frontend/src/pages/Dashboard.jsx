import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import API from "../api/axios";
import SummaryCard from "../components/SummaryCard";
import DataTable from "../components/DataTable";
import StatsChart from "../components/StatsChart";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { searchTerm = "" } = useOutletContext() || {};
  const [stats, setStats] = useState({
    found: 0,
    total: 0,
    lost: 0,
    matched: 0,
  });

  const [chartData, setChartData] = useState([]);

  // ✅ NEW: table data
  const [allData, setAllData] = useState({
    found: [],
    lost: [],
  });

  useEffect(() => {
    // ✅ stats
    API.get("/lost/stats")
      .then((res) =>
        setStats({
          found: res.data.totalFound,
          total: res.data.totalFound + res.data.totalLost,
          lost: res.data.totalLost,
          matched: res.data.totalMatches || res.data.totalMatched || 0,
        })
      )
      .catch(() => {});

    // ✅ chart
    API.get("/lost/stats")
      .then((res) => {
        const data = [
          { day: "Lost", found: 0, inquiry: res.data.totalLost || 0 },
          { day: "Found", found: res.data.totalFound || 0, inquiry: 0 },
          { day: "Pending", found: res.data.pendingMatches || 0, inquiry: 0 },
          { day: "Approved", found: res.data.approvedMatches || 0, inquiry: 0 },
          { day: "Rejected", found: res.data.rejectedMatches || 0, inquiry: 0 },
        ];
        setChartData(data);
      })
      .catch(() => {});

    // ✅ table data
    API.get("/lost/all")
      .then((res) => {
        setAllData({
          found: res.data.found,
          lost: res.data.lost,
        });
      })
      .catch(() => {});
  }, []);

  const filterItems = (items = []) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      const searchableText = [
        item.itemName,
        item.description,
        item.category,
        item.locationFound,
        item.locationLost,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  };

  const filteredData = {
    found: filterItems(allData.found),
    lost: filterItems(allData.lost),
  };

  return (
    <div className="dashboard-page">
      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">
        <SummaryCard title="Found Items" value={stats.found} color="blue" />
        <SummaryCard title="All Entries" value={stats.total} color="red" />
        <SummaryCard title="Lost Inquiries" value={stats.lost} color="green" />
        <SummaryCard title="Matching" value={stats.matched} color="yellow" />
      </div>

      {/* TABLES */}
      <div className="dashboard-table-section">
        <DataTable title="All Found Entries" data={filteredData.found} />
        <DataTable title="Lost Item Inquiry" data={filteredData.lost} />
      </div>

      {/* STATISTICS */}
      <StatsChart data={chartData} />
    </div>
  );
};

export default Dashboard;
