import { useEffect, useState } from "react";
import StatsChart from "../components/StatsChart";
import SummaryCard from "../components/SummaryCard";
import API from "../api/api";
import "../styles/dashboard.css";
import "../styles/statistics.css";

const Statistics = () => {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalMatches: 0,
    pendingMatches: 0,
    approvedMatches: 0,
    rejectedMatches: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/lost/stats");
        const apiStats = {
          totalLost: res.data.totalLost || 0,
          totalFound: res.data.totalFound || 0,
          totalMatches: res.data.totalMatches || 0,
          pendingMatches: res.data.pendingMatches || 0,
          approvedMatches: res.data.approvedMatches || 0,
          rejectedMatches: res.data.rejectedMatches || 0,
        };

        const data = [
          { day: "Lost", found: 0, inquiry: apiStats.totalLost },
          { day: "Found", found: apiStats.totalFound, inquiry: 0 },
          { day: "Pending", found: apiStats.pendingMatches, inquiry: 0 },
          { day: "Approved", found: apiStats.approvedMatches, inquiry: 0 },
          { day: "Rejected", found: apiStats.rejectedMatches, inquiry: 0 },
        ];

        setStats(apiStats);
        setChartData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="statistics-page">
      <h1 className="page-title">Statistics</h1>
      <p className="page-subtitle">
        Overview of found items and lost inquiries
      </p>

      <div className="statistics-cards">
        <SummaryCard title="Total Lost Items" value={stats.totalLost} color="green" />
        <SummaryCard title="Total Found Items" value={stats.totalFound} color="blue" />
        <SummaryCard title="Total Matches" value={stats.totalMatches} color="yellow" />
        <SummaryCard title="Pending" value={stats.pendingMatches} color="red" />
        <SummaryCard title="Confirmed" value={stats.approvedMatches} color="blue" />
        <SummaryCard title="Rejected" value={stats.rejectedMatches} color="red" />
      </div>

      <div className="stats-card">
        <StatsChart data={chartData} />
      </div>
    </div>
  );
};

export default Statistics;
