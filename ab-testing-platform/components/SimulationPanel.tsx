"use client";

import { useState } from "react";
import axios from "axios";

export default function SimulationPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSimulate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/simulate");
      setMessage(
        `Successfully simulated user data for ${response.data.results.length} variant(s)! Run analysis to see results.`
      );
    } catch (error: any) {
      console.error("Error simulating data:", error);
      setMessage(error.response?.data?.error || "Failed to simulate data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <h4
          style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 10px 0" }}
        >
          Simulation Parameters
        </h4>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
          <li>100+ users per variant</li>
          <li>5-15 actions per user</li>
          <li>Realistic behavior patterns</li>
        </ul>
      </div>

      <button
        onClick={handleSimulate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          border: "2px solid #000",
          background: loading ? "#ccc" : "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Running Simulation..." : "Run Simulation"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #000",
            background: message.includes("Failed") ? "#ffe0e0" : "#e0ffe0",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          background: "#f9f9f9",
        }}
      >
        <h4
          style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 10px 0" }}
        >
          Next Steps
        </h4>
        <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
          <li>Run simulation to generate test data</li>
          <li>Navigate to Analytics tab for metrics</li>
          <li>Run terminal analysis for detailed insights</li>
        </ol>
      </div>
    </div>
  );
}
