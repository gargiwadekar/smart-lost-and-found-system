import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/lostInquiry.css";

const LostInquiry = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    dateLost: "",
    locationLost: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    formData.append("userId", user.id || "");
    formData.append("email", user.email || "");

    try {
      const res = await API.post("/lost", formData);

      navigate("/dashboard/matching", {
        state: {
          matches: res.data.matches,
          message: res.data.message,
        },
      });
    } catch (error) {
      alert("Failed to search matching items");
      console.error(error);
    }
  };

  return (
    <div className="entry-page">
      <div className="entry-header">
        <h1>Lost Item Inquiry</h1>
        <p>Enter details to search and recover your lost item</p>
      </div>

      <div className="card entry-card">
        <form onSubmit={handleSubmit} className="entry-form">

          <div className="entry-form-grid">

            <div className="input-group">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g. Black Wallet"
                required
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option>Bag</option>
                <option>Phone</option>
                <option>ID Card</option>
                <option>Electronics</option>
                <option>Others</option>
              </select>
            </div>

            <div className="input-group">
              <label>Date Lost</label>
              <input
                type="date"
                name="dateLost"
                value={form.dateLost}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Location Lost</label>
              <input
                type="text"
                name="locationLost"
                value={form.locationLost}
                onChange={handleChange}
                placeholder="Library / Lab / Gate"
                required
              />
            </div>

            <div className="input-group full">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Color, brand, marks, condition..."
              />
            </div>

            <div className="input-group full">
              <label>Upload Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-actions">
            <button className="primary-btn" type="submit">
              <FaSearch /> Search Matching Items
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LostInquiry;
