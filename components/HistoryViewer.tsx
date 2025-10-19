"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface HistoryEntry {
  id: string;
  type: "analysis" | "variant";
  timestamp: string;
  data: any;
}

export default function HistoryViewer() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "analysis" | "variant">("all");
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const typeParam = filter === "all" ? "" : `?type=${filter}`;
      const response = await axios.get(`/api/history${typeParam}`);
      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all history? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete("/api/history");
      setHistory([]);
      alert("✅ History cleared successfully");
    } catch (err) {
      alert("❌ Failed to clear history");
      console.error("Error clearing history:", err);
    }
  };

  const downloadHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewDetails = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderAnalysisSummary = (data: any) => {
    return (
      <div>
        <p>
          <strong>Winner:</strong> {data.winner || "None"}
        </p>
        <p>
          <strong>Variants Tested:</strong> {data.variants?.length || 0}
        </p>
        <p>
          <strong>Summary:</strong> {data.summary?.substring(0, 100)}...
        </p>
      </div>
    );
  };

  const renderVariantSummary = (data: any) => {
    return (
      <div>
        <p>
          <strong>Name:</strong> {data.name || "Unknown"}
        </p>
        <p>
          <strong>Description:</strong> {data.description || "N/A"}
        </p>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}
        >
          📚 History
        </h3>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={fetchHistory}
            disabled={loading}
            style={{
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {loading ? "🔄 Loading..." : "🔄 Refresh"}
          </button>

          <button
            onClick={downloadHistory}
            disabled={history.length === 0}
            style={{
              background: history.length === 0 ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: history.length === 0 ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            ⬇️ Download History
          </button>

          <button
            onClick={clearHistory}
            disabled={history.length === 0}
            style={{
              background: history.length === 0 ? "#ccc" : "#dc3545",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: history.length === 0 ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            🗑️ Clear History
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Filter:
          </label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "analysis" | "variant")
            }
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          >
            <option value="all">All</option>
            <option value="analysis">Analyses Only</option>
            <option value="variant">Variants Only</option>
          </select>
        </div>
      </div>

      {history.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "5px",
            color: "#666",
          }}
        >
          <p>No history entries found</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            Run analyses or create variants to build your history
          </p>
        </div>
      ) : (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Timestamp
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Summary
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "3px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        background:
                          entry.type === "analysis" ? "#e3f2fd" : "#f3e5f5",
                        color:
                          entry.type === "analysis" ? "#1976d2" : "#7b1fa2",
                      }}
                    >
                      {entry.type === "analysis" ? "📊 Analysis" : "🎨 Variant"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    {entry.type === "analysis"
                      ? renderAnalysisSummary(entry.data)
                      : renderVariantSummary(entry.data)}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => viewDetails(entry)}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing details */}
      {showModal && selectedEntry && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "800px",
              maxHeight: "80vh",
              overflow: "auto",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
                {selectedEntry.type === "analysis"
                  ? "📊 Analysis Details"
                  : "🎨 Variant Details"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}
            >
              <strong>Timestamp:</strong>{" "}
              {formatTimestamp(selectedEntry.timestamp)}
            </div>

            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "5px",
                fontSize: "14px",
                fontFamily: "monospace",
                overflow: "auto",
                maxHeight: "500px",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(selectedEntry.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
