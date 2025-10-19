"use client";

import { useState, useEffect } from "react";
import DemoWebsite from "@/components/DemoWebsite";
import ModeratorDashboard from "@/components/ModeratorDashboard";
import CapturePanel from "@/components/CapturePanel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import HistoryViewer from "@/components/HistoryViewer";
import { Variant } from "@/types";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [allVariants, setAllVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isCapturing, setIsCapturing] = useState(false);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    loadConfig();
    fetchEventCount();
  }, []);

  const fetchEventCount = async () => {
    try {
      const response = await axios.get("/api/events/export");
      setEventCount(response.data.totalEvents || 0);
    } catch (error) {
      console.error("Error fetching event count:", error);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await axios.get("/api/config");
      const config = response.data;

      const variants = [config.originalVariant, ...config.variants];
      setAllVariants(variants);

      const current =
        variants.find((v) => v.id === config.currentVariant) ||
        config.originalVariant;
      setCurrentVariant(current);
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVariant = async (variantId: string) => {
    try {
      await axios.post("/api/config", { currentVariant: variantId });
      await loadConfig(); // Reload to get updated current variant
    } catch (error) {
      console.error("Failed to apply variant:", error);
    }
  };

  const handleVariantChange = async (variant: Variant) => {
    setCurrentVariant(variant);
    try {
      await axios.post("/api/config", { currentVariant: variant.id });
    } catch (error) {
      console.error("Error updating current variant:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentVariant) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Error</h2>
        <p>Unable to load configuration</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "variants", label: "Variant Generator" },
    { id: "testing", label: "Testing & Analytics" },
    { id: "history", label: "History" },
    { id: "preview", label: "Live Preview" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT SIDEBAR - NAVIGATION */}
      <aside
        style={{
          width: "200px",
          borderRight: "1px solid #000",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              margin: "0 0 5px 0",
            }}
          >
            A/B Testing Platform
          </h1>
          <p style={{ fontSize: "12px", margin: 0 }}>Dashboard</p>
        </div>

        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sections.map((section) => (
              <li key={section.id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    border:
                      activeSection === section.id
                        ? "2px solid #000"
                        : "1px solid #ccc",
                    background:
                      activeSection === section.id ? "#f0f0f0" : "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #ccc",
          }}
        >
          <Link
            href="/"
            style={{
              display: "block",
              padding: "8px 12px",
              border: "1px solid #000",
              textAlign: "center",
              textDecoration: "none",
              color: "#000",
              fontSize: "14px",
            }}
          >
            View Live Site
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: "20px" }}>
        {/* HEADER */}
        <header
          style={{
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "2px solid #000",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 5px 0",
            }}
          >
            {sections.find((s) => s.id === activeSection)?.label}
          </h2>
          <div style={{ fontSize: "12px", marginTop: "10px" }}>
            Last updated: {new Date().toLocaleString()}
          </div>
        </header>

        {/* OVERVIEW SECTION */}
        {activeSection === "overview" && (
          <div>
            {/* Current Active Variant */}
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "2px solid #000",
                background: "#f8f9fa",
              }}
            >
              <h3
                style={{ fontSize: "16px", fontWeight: "bold", marginTop: 0 }}
              >
                🎯 Current Active Variant
              </h3>
              <div style={{ marginTop: "15px" }}>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Name:</strong> {currentVariant.name}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Description:</strong> {currentVariant.description}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "#16a34a" }}>● Active</span>
                </p>
              </div>
              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={() => setActiveSection("preview")}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #000",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginRight: "10px",
                  }}
                >
                  View Preview
                </button>
                <button
                  onClick={() => setActiveSection("variants")}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #000",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Switch Variant
                </button>
              </div>
            </section>

            {/* Essential Tools Grid */}
            <section style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Essential Tools
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "15px",
                }}
              >
                {/* Variant Generator Card */}
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => setActiveSection("variants")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                    🎨
                  </div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Variant Generator
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "0 0 12px 0",
                      color: "#666",
                    }}
                  >
                    Create new AI-powered variants with custom modifications
                  </p>
                  <div style={{ fontSize: "12px", color: "#000" }}>
                    <strong>{allVariants.length}</strong> variants created
                  </div>
                </div>

                {/* Analytics Card */}
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => setActiveSection("testing")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                    📊
                  </div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Analytics & Testing
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "0 0 12px 0",
                      color: "#666",
                    }}
                  >
                    View performance metrics and run comparative analysis
                  </p>
                  <div style={{ fontSize: "12px", color: "#000" }}>
                    Run analytics →
                  </div>
                </div>

                {/* Live Preview Card */}
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => setActiveSection("preview")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                    👁️
                  </div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Live Preview
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "0 0 12px 0",
                      color: "#666",
                    }}
                  >
                    Preview how your variants look in real-time
                  </p>
                  <div style={{ fontSize: "12px", color: "#000" }}>
                    View preview →
                  </div>
                </div>
              </div>
            </section>

            {/* Data Status */}
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "2px solid #000",
                background: "#fff9e6",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginTop: 0,
                  marginBottom: "15px",
                }}
              >
                📊 Data Status
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      margin: "0 0 5px 0",
                      color: "#666",
                    }}
                  >
                    <strong>Tracked Events:</strong>
                  </p>
                  <p
                    style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}
                  >
                    {eventCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      margin: "0 0 5px 0",
                      color: "#666",
                    }}
                  >
                    <strong>Tracking Status:</strong>
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: 0,
                      color: isCapturing ? "#dc2626" : "#666",
                    }}
                  >
                    {isCapturing ? "🔴 Active" : "⚫ Inactive"}
                  </p>
                </div>
              </div>
              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  💡 <strong>Tip:</strong> Data resets are available in the
                  Testing & Analytics section
                </p>
              </div>
            </section>

            {/* Statsig Event Tracking Status */}
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: isCapturing ? "2px solid #dc2626" : "2px solid #ccc",
                background: isCapturing ? "#fef2f2" : "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: 0,
                      marginBottom: "5px",
                    }}
                  >
                    {isCapturing
                      ? "🔴 Statsig Recording Active"
                      : "⚫ Event Tracking"}
                  </h3>
                  <p style={{ fontSize: "14px", margin: 0, color: "#666" }}>
                    {isCapturing
                      ? "Currently tracking user interactions with Statsig"
                      : "Event tracking is currently inactive"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection("testing")}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #000",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Manage Tracking
                </button>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Quick Actions
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setActiveSection("variants")}
                  style={{
                    padding: "10px 20px",
                    border: "2px solid #000",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  + Generate New Variant
                </button>
                <button
                  onClick={() => setActiveSection("testing")}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #000",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Run Analytics
                </button>
                <Link
                  href="/"
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #000",
                    background: "#fff",
                    textDecoration: "none",
                    color: "#000",
                    fontSize: "14px",
                    display: "inline-block",
                  }}
                >
                  View Live Site
                </Link>
                <a
                  href="https://console.statsig.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #000",
                    background: "#fff",
                    textDecoration: "none",
                    color: "#000",
                    fontSize: "14px",
                    display: "inline-block",
                  }}
                >
                  Open Statsig Console →
                </a>
              </div>
            </section>
          </div>
        )}

        {/* VARIANT GENERATOR SECTION */}
        {activeSection === "variants" && (
          <div>
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #000",
              }}
            >
              <h3
                style={{ fontSize: "16px", fontWeight: "bold", marginTop: 0 }}
              >
                AI Variant Generator
              </h3>
              <p style={{ fontSize: "14px", marginBottom: "20px" }}>
                Create new variants using AI-powered generation
              </p>
              <ModeratorDashboard
                onVariantChange={handleVariantChange}
                currentVariant={currentVariant}
              />
            </section>
          </div>
        )}

        {/* TESTING & ANALYTICS SECTION */}
        {activeSection === "testing" && (
          <div>
            {/* Statsig Event Capture */}
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #000",
              }}
            >
              <h3
                style={{ fontSize: "16px", fontWeight: "bold", marginTop: 0 }}
              >
                Statsig Event Capture
              </h3>
              <p style={{ fontSize: "14px", marginBottom: "20px" }}>
                Track real user interactions in real-time with Statsig
              </p>
              <CapturePanel
                onCaptureToggle={setIsCapturing}
                isCapturing={isCapturing}
              />
            </section>

            {/* Analytics Panel */}
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #000",
              }}
            >
              <AnalyticsPanel onApplyVariant={handleApplyVariant} />
            </section>
          </div>
        )}

        {/* HISTORY SECTION */}
        {activeSection === "history" && (
          <div>
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #000",
              }}
            >
              <HistoryViewer />
            </section>
          </div>
        )}

        {/* LIVE PREVIEW SECTION */}
        {activeSection === "preview" && (
          <div>
            <section style={{ border: "1px solid #000" }}>
              <div
                style={{
                  padding: "10px 20px",
                  borderBottom: "1px solid #000",
                  background: "#f5f5f5",
                }}
              >
                <strong>Live Website Preview</strong> -{" "}
                {new Date().toLocaleString()}
              </div>
              <div style={{ padding: 0 }}>
                <DemoWebsite
                  html={currentVariant.html}
                  css={currentVariant.css}
                  variantId={currentVariant.id}
                  captureEnabled={isCapturing}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
