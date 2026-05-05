import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatsChart = ({ data }) => {
  const safeData = data && data.length > 0 ? data : [];

  return (
    <div className="chart-card">
      <h3>Statistics</h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={safeData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line dataKey="found" stroke="#3b82f6" strokeWidth={2} />
          <Line dataKey="inquiry" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;