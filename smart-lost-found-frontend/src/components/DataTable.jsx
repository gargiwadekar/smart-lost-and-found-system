const DataTable = ({ title, data = [] }) => {
  return (
    <div className="table-card">
      <h3 className="section-title">{title}</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, i) => (
              <tr key={i}>
                <td>{item.itemName}</td>
                <td>{item.category}</td>
                <td>
                  <span
                    className={`status ${
                      title.includes("Found") ? "found" : "inquiry"
                    }`}
                  >
                    {item.status || (title.includes("Found") ? "Found" : "Inquiry")}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            // ✅ fallback (if no data)
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
