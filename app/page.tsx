"use client";

import { useState, useEffect } from "react";
import DemoWebsite from "@/components/DemoWebsite";
import { Variant } from "@/types";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [allVariants, setAllVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
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
        <p>Unable to load variant</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          padding: "15px 20px",
          borderBottom: "2px solid #000",
          background: "#fff",
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
            <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              A/B Testing Platform
            </h1>
            <p
              style={{
                fontSize: "12px",
                margin: "5px 0 0 0",
                color: isCapturing ? "#dc2626" : "#666",
              }}
            >
              {isCapturing ? "🔴 Recording with Statsig" : "Live Preview"}
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              padding: "10px 20px",
              border: "2px solid #000",
              textDecoration: "none",
              color: "#000",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: "20px" }}>
        {/* Quick Actions */}
        <section style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a
              href={`/site?variant=${currentVariant.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                border: "2px solid #000",
                background: "#000",
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              🌐 Open Website in New Tab
            </a>
            <Link
              href="/dashboard"
              style={{
                padding: "10px 20px",
                border: "1px solid #000",
                textDecoration: "none",
                color: "#000",
                fontSize: "14px",
              }}
            >
              Manage Variants
            </Link>
            <Link
              href="/dashboard"
              style={{
                padding: "10px 20px",
                border: "1px solid #000",
                textDecoration: "none",
                color: "#000",
                fontSize: "14px",
              }}
            >
              View Analytics
            </Link>
            <a
              href="https://console.statsig.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                border: "1px solid #000",
                background: isCapturing ? "#000" : "#fff",
                color: isCapturing ? "#fff" : "#000",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Statsig Console →
            </a>
          </div>
        </section>

        {/* Variant Switcher */}
        <section
          style={{
            marginBottom: "20px",
            padding: "20px",
            border: "2px solid #000",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: 0,
              marginBottom: "15px",
            }}
          >
            Variant Switcher
          </h2>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Select Variant to Preview:
            </label>
            <select
              value={currentVariant.id}
              onChange={(e) => {
                const selected = allVariants.find(
                  (v) => v.id === e.target.value
                );
                if (selected) handleVariantChange(selected);
              }}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "2px solid #000",
              }}
            >
              {allVariants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} - {variant.description}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Current Variant Info */}
        <section
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #000",
            background: "#f5f5f5",
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
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "0 0 5px 0",
                }}
              >
                Current Variant: {currentVariant.name}
              </h2>
              <p style={{ fontSize: "14px", margin: 0 }}>
                {currentVariant.description}
              </p>
            </div>
            <div style={{ fontSize: "12px" }}>
              Status: <strong>Active</strong>
            </div>
          </div>
        </section>

        {/* Website Preview */}
        <section style={{ border: "2px solid #000" }}>
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "1px solid #000",
              background: "#f5f5f5",
            }}
          >
            <strong>Website Preview</strong> - {new Date().toLocaleString()}
          </div>
          <div>
            <DemoWebsite
              html={currentVariant.html}
              css={currentVariant.css}
              variantId={currentVariant.id}
              captureEnabled={isCapturing}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
