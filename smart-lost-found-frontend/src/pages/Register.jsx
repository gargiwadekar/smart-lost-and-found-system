import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!form.name) newErrors.name = true;
    if (!form.email || !form.email.includes("@")) newErrors.email = true;
    if (!form.phone || form.phone.length !== 10) newErrors.phone = true;
    if (!form.password || form.password.length < 6)
      newErrors.password = true;
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct highlighted fields ❌");
      return;
    }

    try {
      // 🔹 Send data to backend (exclude confirmPassword)
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      };

      await API.post("/auth/register", payload);

      toast.success("Registration successful 🎉");
      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed ❌"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="floating circle1"></div>
      <div className="floating circle2"></div>
      <div className="floating circle3"></div>

      <div className="auth-card">
        <h2>Create Account ✨</h2>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="👤 Full Name"
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />

          <input
            name="email"
            placeholder="📧 Email"
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />

          <input
            name="phone"
            placeholder="📱 Phone"
            onChange={handleChange}
            className={errors.phone ? "input-error" : ""}
          />

          <input
            name="password"
            type="password"
            placeholder="🔒 Password"
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="🔁 Confirm Password"
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
          />

          <button className="auth-btn">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
