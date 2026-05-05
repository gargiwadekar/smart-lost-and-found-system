const HistoryTable = ({ title, data = [], columns = ["itemName", "type", "status", "date"] }) => {
  return (
    <div className="table-card">
      <h3 className="section-title">{title}</h3>

      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>
                {column === "itemName"
                  ? "Item Name"
                  : column === "matchedUser"
                  ? "Matched User"
                  : column === "completedAt"
                  ? "Completed At"
                  : column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={`${row.itemName}-${index}`}>
                {columns.map((column) => (
                  <td key={column}>
                    {["date", "completedAt"].includes(column) && row[column]
                      ? new Date(row[column]).toLocaleDateString()
                      : row[column] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
