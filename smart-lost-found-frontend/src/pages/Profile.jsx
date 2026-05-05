import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import ProfileCard from "../components/ProfileCard";
import HistoryTable from "../components/HistoryTable";
import "../styles/dashboard.css";

const Profile = () => {
  const apiRoot = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
    .replace(/\/api\/?$/, "");

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/profile");
      setProfile(res.data.user);
      setStats(res.data.stats);
      setActivity(res.data.activity);
      setHistory(res.data.history);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = async () => {
    const name = window.prompt("Enter your name", profile?.name || "");

    if (!name) return;

    try {
      const res = await API.put("/user/update", { name });
      setProfile((current) => ({ ...current, name: res.data.user.name }));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          name: res.data.user.name,
        })
      );
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const res = await API.post("/user/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile((current) => ({
        ...current,
        profileImage: res.data.profileImage,
      }));
      toast.success("Profile photo uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-main">
        <div className="table-card">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <div className="dashboard-page">
        <ProfileCard
          profile={profile}
          stats={stats}
          onEdit={handleEdit}
          onPhotoChange={handlePhotoChange}
          apiRoot={apiRoot}
        />

        <HistoryTable title="Activity History" data={activity} />
        <HistoryTable
          title="Completed Match History"
          data={history}
          columns={["itemName", "matchedUser", "status", "completedAt"]}
        />
      </div>
    </div>
  );
};

export default Profile;
