const SummaryCard = ({ title, value, color }) => {
  return (
    <div className={`card ${color}`}>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  );
};

export default SummaryCard;
