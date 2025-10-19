"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import InteractiveChart from "./InteractiveChart";

interface VariantMetrics {
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
  source?: string;
}

interface AnalysisResult {
  winner: string | null;
  summary: string;
  insights: string[];
  recommendations: string[];
  metrics: {
    [variantId: string]: VariantMetrics;
  };
  variants: Array<{ id: string; name: string }>;
  source?: string;
  warning?: string;
  eventCount?: number;
  timestamp?: string;
}

interface AnalyticsPanelProps {
  onApplyVariant?: (variantId: string) => void;
}

export default function AnalyticsPanel({
  onApplyVariant,
}: AnalyticsPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"text" | "visual" | "both">("both");

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/analyze");
      const analysisData = response.data;
      setAnalysis(analysisData);

      // Save to history
      await axios
        .post("/api/history", {
          type: "analysis",
          data: analysisData,
        })
        .catch((err) => console.error("Failed to save to history:", err));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch analysis");
    } finally {
      setLoading(false);
    }
  };

  const resetData = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all event data? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.post("/api/events/clear");
      alert("✅ All event data has been cleared");
      setAnalysis(null);
    } catch (err) {
      alert("❌ Failed to clear data");
      console.error("Error clearing data:", err);
    }
  };

  const downloadData = async () => {
    try {
      // Download events
      const eventsResponse = await axios.get("/api/events/export");
      const eventsData = eventsResponse.data;

      // Combine with current analysis if available
      const exportData = {
        exportedAt: new Date().toISOString(),
        analysis: analysis || null,
        events: eventsData,
      };

      // Create download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ab-test-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("✅ Data downloaded successfully!");
    } catch (err) {
      alert("❌ Failed to download data");
      console.error("Error downloading data:", err);
    }
  };

  const applyWinningVariant = async () => {
    if (!analysis?.winner) return;

    try {
      await axios.post("/api/config", { currentVariant: analysis.winner });
      if (onApplyVariant) {
        onApplyVariant(analysis.winner);
      }
      alert("✅ Successfully applied winning variant!");
    } catch (err) {
      alert("❌ Failed to apply variant");
    }
  };

  const createBarChart = (
    label: string,
    value: number,
    maxValue: number,
    unit: string = "%"
  ) => {
    const barLength = 20;
    const filledLength = Math.round((value / maxValue) * barLength);
    const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);
    return `${label.padEnd(15)} │ ${bar} │ ${value.toFixed(2)}${unit}`;
  };

  const getDataSourceBanner = () => {
    if (!analysis) return null;

    const isUsingFallbackData =
      analysis.source === "simulated_fallback" || analysis.warning;
    const isUsingLocalEvents = analysis.source === "local_events_real";

    if (isUsingFallbackData) {
      return (
        <div
          style={{
            background: "#fef3cd",
            border: "1px solid #f6d55c",
            color: "#856404",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <strong>
            ⚠️ WARNING: USING SIMULATED FALLBACK DATA (NOT REAL USER DATA!)
          </strong>
          <div style={{ marginTop: "10px" }}>
            <p>This data is randomly generated for testing purposes.</p>
            <p>
              <strong>To use REAL data:</strong>
            </p>
            <ol style={{ marginLeft: "20px", marginTop: "5px" }}>
              <li>Click "Start Capture" on the live preview</li>
              <li>Click buttons multiple times on the website</li>
              <li>Run this analysis again</li>
            </ol>
          </div>
        </div>
      );
    } else if (isUsingLocalEvents) {
      return (
        <div
          style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            color: "#155724",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <strong>✅ USING REAL DATA FROM YOUR ACTUAL CLICKS!</strong>
          {analysis.eventCount && (
            <div style={{ marginTop: "5px" }}>
              📊 Total events tracked: {analysis.eventCount}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            color: "#155724",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <strong>✅ USING REAL STATSIG DATA FROM ACTUAL USERS!</strong>
        </div>
      );
    }
  };

  const renderWinnerBanner = () => {
    if (!analysis?.winner) return null;

    const winnerVariant = analysis.variants.find(
      (v) => v.id === analysis.winner
    );
    if (!winnerVariant) return null;

    return (
      <div
        style={{
          background: "#28a745",
          color: "white",
          padding: "20px",
          borderRadius: "5px",
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        🏆 RECOMMENDED VARIANT: {winnerVariant.name.toUpperCase()}
      </div>
    );
  };

  const renderMetricsTable = () => {
    if (!analysis) return null;

    const variants = analysis.variants;
    const metrics = analysis.metrics;

    return (
      <div style={{ marginBottom: "30px" }}>
        <h4
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px" }}
        >
          📊 Performance Metrics
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                  }}
                >
                  Variant
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Impressions
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Clicks
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  CTR
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Conversions
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Conv. Rate
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Avg. Time
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => {
                const variantMetrics = metrics[variant.id];
                return (
                  <tr
                    key={variant.id}
                    style={{
                      background:
                        variant.id === analysis.winner ? "#e8f5e8" : "white",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      {variant.name}
                      {variant.id === analysis.winner && " 🏆"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.impressions.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.clicks.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.clickThroughRate.toFixed(2)}%
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.conversions.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.conversionRate.toFixed(2)}%
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.avgTimeOnPage.toFixed(1)}s
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {variantMetrics.bounceRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderVisualComparisons = () => {
    if (!analysis) return null;

    const variants = analysis.variants;
    const metrics = analysis.metrics;

    // Generate colors for each variant
    const colors = [
      "#007bff", // Blue
      "#28a745", // Green
      "#dc3545", // Red
      "#ffc107", // Yellow
      "#17a2b8", // Cyan
      "#6610f2", // Purple
    ];

    // Prepare data for CTR chart
    const ctrData = variants.map((variant, index) => ({
      label: variant.name,
      value: metrics[variant.id].clickThroughRate,
      color: colors[index % colors.length],
      isWinner: variant.id === analysis.winner,
    }));

    // Prepare data for Conversion Rate chart
    const conversionData = variants.map((variant, index) => ({
      label: variant.name,
      value: metrics[variant.id].conversionRate,
      color: colors[index % colors.length],
      isWinner: variant.id === analysis.winner,
    }));

    // Prepare data for Impressions chart
    const impressionsData = variants.map((variant, index) => ({
      label: variant.name,
      value: metrics[variant.id].impressions,
      color: colors[index % colors.length],
      isWinner: variant.id === analysis.winner,
    }));

    // Prepare data for Clicks chart
    const clicksData = variants.map((variant, index) => ({
      label: variant.name,
      value: metrics[variant.id].clicks,
      color: colors[index % colors.length],
      isWinner: variant.id === analysis.winner,
    }));

    // Prepare data for Avg Time on Page chart
    const timeData = variants.map((variant, index) => ({
      label: variant.name,
      value: metrics[variant.id].avgTimeOnPage,
      color: colors[index % colors.length],
      isWinner: variant.id === analysis.winner,
    }));

    // Prepare data for Bounce Rate chart
    const bounceData = variants.map((variant, index) => ({
      label: variant.name,
      value: metrics[variant.id].bounceRate,
      color: colors[index % colors.length],
      isWinner: variant.id === analysis.winner,
    }));

    return (
      <div style={{ marginBottom: "30px" }}>
        <h4
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}
        >
          📈 Interactive Performance Charts
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
          }}
        >
          <InteractiveChart
            title="📊 Click-Through Rate (CTR)"
            data={ctrData}
            unit="%"
          />

          <InteractiveChart
            title="🎯 Conversion Rate"
            data={conversionData}
            unit="%"
          />

          <InteractiveChart
            title="👁️ Impressions"
            data={impressionsData}
            unit=""
          />

          <InteractiveChart title="🖱️ Total Clicks" data={clicksData} unit="" />

          <InteractiveChart
            title="⏱️ Average Time on Page"
            data={timeData}
            unit="s"
          />

          <InteractiveChart
            title="📉 Bounce Rate (Lower is Better)"
            data={bounceData}
            unit="%"
          />
        </div>
      </div>
    );
  };

  const renderAIAnalysis = () => {
    if (!analysis) return null;

    return (
      <div style={{ marginBottom: "30px" }}>
        <h4
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px" }}
        >
          🤖 AI Analysis
        </h4>

        <div style={{ marginBottom: "20px" }}>
          <h5
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            📋 Summary:
          </h5>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            {analysis.summary}
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h5
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            💡 Key Insights:
          </h5>
          <ul
            style={{ fontSize: "14px", lineHeight: "1.5", marginLeft: "20px" }}
          >
            {analysis.insights.map((insight, i) => (
              <li key={i} style={{ marginBottom: "5px" }}>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            🎯 Recommendations:
          </h5>
          <ul
            style={{ fontSize: "14px", lineHeight: "1.5", marginLeft: "20px" }}
          >
            {analysis.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: "5px" }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}
        >
          🧪 Testing & Analytics
        </h3>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            style={{
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {loading ? "🔄 Analyzing..." : "📊 Run Analysis"}
          </button>

          <button
            onClick={downloadData}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            ⬇️ Download Data
          </button>

          <button
            onClick={resetData}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            🗑️ Reset Data
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#f8d7da",
              border: "1px solid #f5c6cb",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            ❌ {error}
          </div>
        )}

        {analysis && (
          <>
            {getDataSourceBanner()}
            {renderWinnerBanner()}

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginRight: "15px",
                }}
              >
                View Mode:
              </label>
              <select
                value={viewMode}
                onChange={(e) =>
                  setViewMode(e.target.value as "text" | "visual" | "both")
                }
                style={{
                  padding: "5px 10px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "14px",
                }}
              >
                <option value="text">📝 Text Summary Only</option>
                <option value="visual">📊 Visual Dashboard</option>
                <option value="both">📋 Both (Detailed View)</option>
              </select>
            </div>

            {(viewMode === "visual" || viewMode === "both") && (
              <>
                {renderMetricsTable()}
                {renderVisualComparisons()}
              </>
            )}

            {(viewMode === "text" || viewMode === "both") && renderAIAnalysis()}

            <div
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "5px",
                background: "#f9f9f9",
                marginTop: "30px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                🎯 Actions
              </h4>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {analysis.winner && (
                  <button
                    onClick={applyWinningVariant}
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Apply Winning Variant
                  </button>
                )}

                <button
                  onClick={fetchAnalysis}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  🔄 Refresh Analysis
                </button>
              </div>

              {analysis.winner && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#28a745",
                    marginTop: "10px",
                  }}
                >
                  ✅ AI has analyzed the data and selected a recommended winner.
                </p>
              )}
            </div>

            {analysis.timestamp && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "15px",
                  textAlign: "right",
                }}
              >
                Last updated: {new Date(analysis.timestamp).toLocaleString()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
