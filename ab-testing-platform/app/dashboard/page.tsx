"use client";

import { useState, useEffect } from "react";
import DemoWebsite from "@/components/DemoWebsite";
import ModeratorDashboard from "@/components/ModeratorDashboard";
import CapturePanel from "@/components/CapturePanel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { Variant } from "@/types";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [allVariants, setAllVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

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
      await axios.post('/api/config', { currentVariant: variantId });
      await loadConfig(); // Reload to get updated current variant
    } catch (error) {
      console.error('Failed to apply variant:', error);
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
            {/* Quick Actions */}
            <section style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Quick Actions
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15px",
                }}
              >
                <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Actions
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "8px" }}>
                      <button
                        onClick={() => setActiveSection("variants")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Generate New Variant
                      </button>
                    </li>
                    <li style={{ marginBottom: "8px" }}>
                      <button
                        onClick={() => setActiveSection("testing")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Run Simulation
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection("testing")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Run Analytics
                      </button>
                    </li>
                  </ul>
                </div>
                <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Recent Activity
                  </h4>
                  <ul
                    style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}
                  >
                    <li style={{ marginBottom: "5px" }}>
                      Variant activated - 2 min ago
                    </li>
                    <li style={{ marginBottom: "5px" }}>
                      New variant generated - 1 hour ago
                    </li>
                    <li>Simulation completed - 3 hours ago</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Current Variant Info */}
            <section
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "2px solid #000",
              }}
            >
              <h3
                style={{ fontSize: "16px", fontWeight: "bold", marginTop: 0 }}
              >
                Current Active Variant
              </h3>
              <div style={{ marginTop: "15px" }}>
                <p style={{ margin: "5px 0" }}>
                  <strong>Name:</strong> {currentVariant.name}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Description:</strong> {currentVariant.description}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Status:</strong> Active
                </p>
              </div>
            </section>

            {/* Key Metrics */}
            <section style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Key Metrics
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "15px",
                }}
              >
                <div style={{ border: "1px solid #000", padding: "15px" }}>
                  <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Total Variants
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>12</div>
                </div>
                <div style={{ border: "1px solid #000", padding: "15px" }}>
                  <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Active Tests
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>3</div>
                </div>
                <div style={{ border: "1px solid #000", padding: "15px" }}>
                  <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Conversion Rate
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    4.2%
                  </div>
                </div>
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
