import SummaryCard from "./SummaryCard";

const ProfileCard = ({ profile, stats, onEdit, onPhotoChange, apiRoot }) => {
  const imageUrl = profile?.profileImage
    ? `${apiRoot}/uploads/${profile.profileImage}`
    : "";

  return (
    <>
      <div className="table-card">
        <h3 className="section-title">User Info</h3>

        <div className="user-area" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <div className="user-info-box">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="avatar"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="avatar">{profile?.name?.charAt(0)}</div>
            )}
            <div>
              <strong>{profile?.name}</strong>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>{profile?.email}</p>
            </div>
          </div>

          <div className="match-buttons" style={{ marginTop: 0 }}>
            <label className="primary-btn" style={{ textAlign: "center" }}>
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                style={{ display: "none" }}
              />
            </label>
            <button className="danger-btn" type="button" onClick={onEdit}>
              Edit Profile
            </button>
          </div>
        </div>

        <p style={{ marginTop: 18 }}>
          <strong>Trust Score:</strong> {profile?.trustScore || 0}%
        </p>
      </div>

      <div className="dashboard-cards">
        <SummaryCard title="Total Lost Items" value={stats.totalLostItems || 0} color="green" />
        <SummaryCard title="Total Found Items" value={stats.totalFoundItems || 0} color="blue" />
        <SummaryCard title="Total Matches" value={stats.totalMatches || 0} color="yellow" />
        <SummaryCard title="Successful Recoveries" value={stats.successfulRecoveries || 0} color="red" />
      </div>
    </>
  );
};

export default ProfileCard;
