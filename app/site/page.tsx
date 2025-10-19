"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DemoWebsite from "@/components/DemoWebsite";
import { Variant } from "@/types";
import axios from "axios";

function StandaloneSiteContent() {
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const variantId = searchParams.get("variant"); // Get variant ID from URL

  useEffect(() => {
    loadCurrentVariant();
  }, [variantId]);

  const loadCurrentVariant = async () => {
    try {
      const response = await axios.get("/api/config");
      const config = response.data;

      const variants = [config.originalVariant, ...config.variants];

      let selectedVariant;

      // If a specific variant ID is provided in URL, use that
      if (variantId) {
        selectedVariant = variants.find((v) => v.id === variantId);
        if (!selectedVariant) {
          setError(`Variant "${variantId}" not found`);
          return;
        }
      } else {
        // Otherwise, randomly select from active variants (simulating A/B test)
        const activeVariants = variants.filter((v) => v.isActive);

        if (activeVariants.length > 0) {
          const randomIndex = Math.floor(Math.random() * activeVariants.length);
          selectedVariant = activeVariants[randomIndex];
        } else {
          // Fallback to current variant if no active variants
          selectedVariant =
            variants.find((v) => v.id === config.currentVariant) ||
            config.originalVariant;
        }
      }

      setCurrentVariant(selectedVariant);
    } catch (err) {
      console.error("Error loading variant:", err);
      setError("Failed to load website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>
            Loading...
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            Preparing your experience
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentVariant) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Error</h2>
          <p style={{ fontSize: "14px", marginBottom: "20px" }}>
            {error || "Unable to load website"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              border: "2px solid #000",
              background: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the website in standalone mode with impression tracking enabled
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <DemoWebsite
        html={currentVariant.html}
        css={currentVariant.css}
        variantId={currentVariant.id}
        captureEnabled={true}
        showRecordingBadge={false}
      />
    </div>
  );
}

export default function StandaloneSite() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>
              Loading...
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Preparing your experience
            </div>
          </div>
        </div>
      }
    >
      <StandaloneSiteContent />
    </Suspense>
  );
}
