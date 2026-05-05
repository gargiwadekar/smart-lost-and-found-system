import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginWithPassword,
  resendOtp,
  verifyLoginOtp,
} from "../services/authService";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email) newErrors.email = "Email required";
    else if (!email.includes("@")) newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password required";
    else if (password.length < 6)
      newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors ❌");
      return;
    }

    try {
      // 🔹 Send login request
      setLoading(true);
      const res = await loginWithPassword({
        email,
        password
      });

      // 🔹 Store auth data
      setPendingUser(res.data.user);
      setIsOtpStep(true);

      toast.success("Login successful 🎉");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Enter the 6 digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyLoginOtp({ email, otp });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await resendOtp(email);
      toast.success("OTP resent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="floating circle1"></div>
      <div className="floating circle2"></div>
      <div className="floating circle3"></div>

      <div className="auth-card">
        <h2>Welcome Back 👋</h2>

        {!isOtpStep ? (
        <form onSubmit={handleLogin}>
          <input
            className={errors.email ? "input-error" : ""}
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={errors.password ? "input-error" : ""}
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Login"}
          </button>
        </form>
        ) : (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="auth-footer">
            OTP sent to {pendingUser?.email || email}.{" "}
            <button type="button" className="auth-link-btn" onClick={handleResendOtp}>
              Resend OTP
            </button>
          </p>
        </form>
        )}

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
