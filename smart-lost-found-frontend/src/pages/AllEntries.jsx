import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import API from "../api/api";
import "../styles/allEntries.css";

const AllEntries = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/lost/all");

        const lostItems = res.data.lost.map((item) => ({
          item: item.itemName,
          category: item.category,
          status: item.status || "Lost",
          date: item.dateLost,
        }));

        const foundItems = res.data.found.map((item) => ({
          item: item.itemName,
          category: item.category,
          status: item.status || "Found",
          date: item.dateFound,
        }));

        setEntries([...lostItems, ...foundItems]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="all-entries-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>All Entries</h1>
        <p>Browse all lost & found items in one place</p>
      </div>

      {/* SEARCH BAR */}
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by item, category or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((e, i) => (
              <tr key={i}>
                <td>{e.item}</td>
                <td>{e.category}</td>
                <td>
                  <span className={`status ${e.status.toLowerCase()}`}>
                    {e.status}
                  </span>
                </td>
                <td>
                  {e.date
                    ? new Date(e.date).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEntries;
