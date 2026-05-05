import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import "../styles/matching.css";

const Matching = () => {
  const { state } = useLocation();
  const apiRoot = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
    .replace(/\/api\/?$/, "");

  const matches = state?.matches || [];
  const message =
    state?.message ||
    "No matching items found yet. Please check again later.";

  const [localMatches, setLocalMatches] = useState(matches);
  const [loadingKey, setLoadingKey] = useState("");

  useEffect(() => {
    if (matches.length > 0) return;

    API.get("/match")
      .then((res) => {
        const mappedMatches = res.data.map((match) => ({
          _id: match.foundItem?._id,
          matchId: match._id,
          status: match.status,
          itemName: match.foundItem?.itemName,
          locationFound: match.foundItem?.locationFound,
          description: match.foundItem?.description,
          image: match.foundItem?.image,
          collectionInfo: match.foundItem?.collectionInfo,
          matchConfidence: match.confidence,
          isFoundOwner: match.isFoundOwner,
          isLostOwner: match.isLostOwner,
        }));

        setLocalMatches(mappedMatches);
      })
      .catch(() => {});
  }, [matches.length]);

  const handleAction = async (index, status) => {
    if (status === "rejected") {
      const updated = [...localMatches];
      updated[index].status = "rejected";
      setLocalMatches(updated);
      return;
    }

    const verificationAnswers = {
      color: window.prompt("What is the item color?") || "",
      brand: window.prompt("What is the item brand?") || "",
      uniqueMark: window.prompt("Any unique mark?") || "",
    };

    try {
      setLoadingKey(`claim-${index}`);
      const selectedItem = localMatches[index];
      const res = await API.post("/match", {
        lostItemId: selectedItem.lostItemId,
        foundItemId: selectedItem._id,
        verificationAnswers,
      });

      const updated = [...localMatches];
      updated[index] = {
        ...updated[index],
        matchId: res.data.match._id,
        status: res.data.match.status,
        collectionInfo: res.data.match.foundItem?.collectionInfo,
      };

      setLocalMatches(updated);
      toast.success(res.data.message || "Claim request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send claim request");
    } finally {
      setLoadingKey("");
    }
  };

  const handleLocalAction = (index, status) => {
    const updated = [...localMatches];

    updated[index].status = status;

    // ✅ FIX: DO NOT OVERRIDE collectionInfo
    setLocalMatches(updated);
  };

  const handleFoundDecision = async (index, status) => {
    try {
      setLoadingKey(`decision-${index}`);
      const selectedItem = localMatches[index];
      const res = await API.put(`/match/${selectedItem.matchId}`, { status });
      const updated = [...localMatches];

      updated[index] = {
        ...updated[index],
        status: res.data.match.status,
        collectionInfo: res.data.match.foundItem?.collectionInfo,
      };

      setLocalMatches(updated);
      toast.success(status === "approved" ? "Claim approved" : "Claim rejected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update claim");
    } finally {
      setLoadingKey("");
    }
  };

  void handleLocalAction;

  const handleCollection = async (index, collected) => {
    try {
      setLoadingKey(`collection-${index}`);
      const selectedItem = localMatches[index];
      const res = await API.put(`/match/${selectedItem.matchId}/collection`, {
        collected,
      });
      const updated = [...localMatches];

      updated[index] = {
        ...updated[index],
        status: res.data.match.status,
      };

      setLocalMatches(updated);
      toast.success(collected ? "Item marked as collected" : "Collection kept pending");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update collection");
    } finally {
      setLoadingKey("");
    }
  };

  const timelineSteps = ["requested", "approved", "collected"];

  const getTimelineIndex = (status) => timelineSteps.indexOf(status);

  return (
    <div className="matching-page">
      <h1 className="page-title">Matching Results</h1>

      {localMatches.length === 0 ? (
        <div className="no-data-card">
          <p>{message}</p>
        </div>
      ) : (
        <div className="matching-grid">
          {localMatches.map((item, index) => (
            <div className="match-card" key={item._id || index}>

              {/* IMAGE */}
              {item.image && (
                <img
                  src={`${apiRoot}/uploads/${item.image}`}
                  alt="item"
                  className="match-image"
                />
              )}

              {/* CONTENT */}
              <div className="match-content">
                <h3>Found: {item.itemName}</h3>

                <p><strong>Location:</strong> {item.locationFound}</p>
                <p><strong>Description:</strong> {item.description}</p>
                {item.matchConfidence !== undefined && (
                  <p><strong>Match Confidence:</strong> {item.matchConfidence}%</p>
                )}

                {/* STATUS */}
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        ["approved", "collected"].includes(item.status)
                          ? "green"
                          : item.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {item.status === "requested"
                      ? "Approval requested"
                      : item.status === "pending"
                      ? "Pending"
                      : item.status || "pending"}
                  </span>
                </p>

                {item.matchId && (
                  <div className="match-timeline">
                    {timelineSteps.map((step, stepIndex) => (
                      <span
                        key={step}
                        className={
                          stepIndex <= getTimelineIndex(item.status)
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                )}

                {/* ✅ FINAL FIX HERE */}
                {["approved", "collected"].includes(item.status) && (
                  <p style={{ color: "green", fontWeight: "600" }}>
                    📍 {item.collectionInfo || "No collection details provided"}
                  </p>
                )}
                {item.status === "rejected" && (
                  <p style={{ color: "red", fontWeight: "600" }}>
                    Claim rejected
                  </p>
                )}
                {item.status === "collected" && (
                  <p style={{ color: "green", fontWeight: "600" }}>
                    Collection completed
                  </p>
                )}

                {/* BUTTONS */}
                {item.isFoundOwner && item.status === "requested" && (
                  <div className="match-buttons">
                    <button
                      className="primary-btn"
                      disabled={loadingKey === `decision-${index}`}
                      onClick={() => handleFoundDecision(index, "approved")}
                    >
                      {loadingKey === `decision-${index}` ? "Updating..." : "Approve"}
                    </button>

                    <button
                      className="danger-btn"
                      disabled={loadingKey === `decision-${index}`}
                      onClick={() => handleFoundDecision(index, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {item.isLostOwner && item.status === "approved" && (
                  <div className="match-buttons">
                    <button
                      className="primary-btn"
                      disabled={loadingKey === `collection-${index}`}
                      onClick={() => handleCollection(index, true)}
                    >
                      {loadingKey === `collection-${index}` ? "Updating..." : "Collected"}
                    </button>

                    <button
                      className="danger-btn"
                      disabled={loadingKey === `collection-${index}`}
                      onClick={() => handleCollection(index, false)}
                    >
                      Not Collected
                    </button>
                  </div>
                )}

                {item.status !== "approved" &&
                  item.status !== "pending" &&
                  item.status !== "requested" &&
                  item.status !== "rejected" &&
                  item.status !== "collected" && (
                    <div className="match-buttons">
                      <button
                        className="primary-btn"
                        disabled={loadingKey === `claim-${index}`}
                        onClick={() =>
                          handleAction(index, "requested")
                        }
                      >
                        {loadingKey === `claim-${index}` ? "Sending..." : "Proceed for Approval"}
                      </button>

                      <button
                        className="danger-btn"
                        onClick={() =>
                          handleAction(index, "rejected")
                        }
                      >
                        Not mine
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matching;
