import { useState } from "react";
import "../styles/foundEntry.css";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaAlignLeft,
  FaUpload
} from "react-icons/fa";

/* ✅ SAME IMPORT */
import API from "../api/axios";
import { toast } from "react-toastify";

const FoundEntry = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    date: "",
    location: "",
    description: "",
    collectionInfo: "", // ✅ ADDED
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  /* ✅ SAME LOGIC — ONLY ADDED collectionInfo */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("itemName", form.name);
      formData.append("category", form.category);
      formData.append("dateFound", form.date);
      formData.append("locationFound", form.location);
      formData.append("description", form.description);
      formData.append("collectionInfo", form.collectionInfo); // ✅ ADDED
      formData.append("image", form.image);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      formData.append("userId", user.id || "");
      formData.append("email", user.email || "");

      await API.post("/found", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Found item submitted successfully ✅");

      /* reset */
      setForm({
        name: "",
        category: "",
        date: "",
        location: "",
        description: "",
        collectionInfo: "", // ✅ RESET
        image: null
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to submit found item ❌");
    }
  };

  return (
    <div className="found-page">
      <h1>Found Item Entry</h1>
      <p className="subtitle">
        Add details of the item you have found
      </p>

      <form className="found-card" onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* Item Name */}
          <div className="field">
            <label>Item Name</label>
            <div className="input-icon">
              <FaBoxOpen />
              <input
                type="text"
                name="name"
                placeholder="e.g. Black Wallet"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="field">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option>Accessories</option>
              <option>Documents</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Others</option>
            </select>
          </div>

          {/* Date */}
          <div className="field">
            <label>Date Found</label>
            <div className="input-icon">
              <FaCalendarAlt />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="field">
            <label>Location Found</label>
            <div className="input-icon">
              <FaMapMarkerAlt />
              <input
                type="text"
                name="location"
                placeholder="Library / Hostel / Gate"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="field full">
            <label>Description</label>
            <div className="input-icon textarea">
              <FaAlignLeft />
              <textarea
                name="description"
                placeholder="Color, brand, marks, condition..."
                rows="4"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ✅ COLLECTION DETAILS (NEW FIELD) */}
          <div className="field full">
            <label>Collection Details</label>
            <div className="input-icon textarea">
              <FaAlignLeft />
              <textarea
                name="collectionInfo"
                placeholder="Collect from 402 lab on 25 March at 2PM"
                rows="3"
                value={form.collectionInfo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Upload Image */}
          <div className="field full">
            <label>Upload Image</label>

            <label className="upload-box">
              <FaUpload />
              <span>
                {form.image ? form.image.name : "Click to choose file"}
              </span>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <button className="submit-btn">
          Submit Found Item
        </button>
      </form>
    </div>
  );
};

export default FoundEntry;
