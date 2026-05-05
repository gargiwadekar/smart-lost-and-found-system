import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import HowToUse from "./pages/HowToUse";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import FoundEntry from "./pages/FoundEntry";
import LostInquiry from "./pages/LostInquiry";
import AllEntries from "./pages/AllEntries";
import Matching from "./pages/Matching";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }
        />

        <Route
          path="/how-to-use"
          element={
            <>
              <Header />
              <HowToUse />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Header />
              <AboutUs />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
            </>
          }
        />

        {/* 🔐 DASHBOARD ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="found" element={<FoundEntry />} />
          <Route path="lost" element={<LostInquiry />} />
          <Route path="all" element={<AllEntries />} />
          <Route path="matching" element={<Matching />} />
          <Route path="stats" element={<Statistics />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
