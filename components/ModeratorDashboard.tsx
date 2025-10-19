"use client";

import { useState, useEffect } from "react";
import { Variant } from "@/types";
import axios from "axios";

interface ModeratorDashboardProps {
  onVariantChange: (variant: Variant) => void;
  currentVariant: Variant;
}

export default function ModeratorDashboard({
  onVariantChange,
  currentVariant,
}: ModeratorDashboardProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [variantCount, setVariantCount] = useState(2);
  const [message, setMessage] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  useEffect(() => {
    loadVariants();
  }, []);

  const loadVariants = async () => {
    try {
      const response = await axios.get("/api/variants");
      setVariants(response.data.variants);
    } catch (error) {
      console.error("Error loading variants:", error);
      setMessage("Failed to load variants");
    }
  };

  const handleGenerateVariants = async () => {
    if (!prompt.trim()) {
      setMessage("Please enter a prompt");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/variants/generate", {
        prompt,
        currentHtml: currentVariant.html,
        currentCss: currentVariant.css,
        variantCount,
      });

      let successMessage = `Successfully generated ${response.data.variants.length} variant(s)!`;
      
      // Check if Statsig experiment was created
      if (response.data.experimentCreated && response.data.experiment) {
        successMessage += `\n🔬 Statsig experiment "${response.data.experiment.name}" created successfully!`;
        successMessage += `\n📊 Experiment ID: ${response.data.experiment.id}`;
      } else if (response.data.experimentCreated === false) {
        successMessage += `\n⚠️  Variants created but Statsig experiment creation failed (check console for details)`;
      } else {
        successMessage += `\nℹ️  Statsig experiment creation skipped (STATSIG_CONSOLE_KEY not configured)`;
      }

      setMessage(successMessage);
      setPrompt("");
      await loadVariants();
    } catch (error: any) {
      console.error("Error generating variants:", error);
      setMessage(error.response?.data?.error || "Failed to generate variants");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      await axios.delete("/api/variants", { data: { variantId } });
      setMessage("Variant deleted successfully");
      await loadVariants();
    } catch (error: any) {
      console.error("Error deleting variant:", error);
      setMessage(error.response?.data?.error || "Failed to delete variant");
    }
  };

  const handleToggleVariant = async (variant: Variant) => {
    try {
      await axios.patch("/api/variants", {
        variantId: variant.id,
        updates: { isActive: !variant.isActive },
      });
      await loadVariants();
    } catch (error: any) {
      console.error("Error toggling variant:", error);
      setMessage(error.response?.data?.error || "Failed to toggle variant");
    }
  };

  const handleAutoGenerate = async () => {
    setIsGeneratingPrompt(true);
    setMessage("");

    try {
      // Call AI to generate an intelligent prompt based on current variant
      const response = await axios.post("/api/prompts/generate", {
        currentHtml: currentVariant.html,
        currentCss: currentVariant.css,
      });

      const generatedPrompt = response.data.prompt;
      setPrompt(generatedPrompt);
      setMessage(`🤖 AI generated prompt: "${generatedPrompt}"`);

      // Automatically start generating variants after a brief delay
      setTimeout(() => {
        handleGenerateVariants();
      }, 1500);
    } catch (error: any) {
      console.error("Error generating prompt:", error);

      // Fallback to random selection if AI fails
      const fallbackPrompts = [
        "Make the call-to-action button more prominent with a contrasting color and larger size",
        "Improve the hero section with better visual hierarchy and clear value proposition",
        "Add visual elements like icons or illustrations to break up text-heavy sections",
        "Optimize the layout for mobile devices with better spacing and touch targets",
      ];

      const randomPrompt =
        fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
      setPrompt(randomPrompt);
      setMessage(`Using fallback prompt (AI unavailable): "${randomPrompt}"`);

      setTimeout(() => {
        handleGenerateVariants();
      }, 1500);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <div>
      {/* Generation Form */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ccc",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Describe changes:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Make the signup button larger and green"
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #000",
              fontFamily: "inherit",
            }}
          />
          <div style={{ fontSize: "12px", marginTop: "5px" }}>
            Be specific about what you want to change
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Number of variants:
          </label>
          <select
            value={variantCount}
            onChange={(e) => setVariantCount(Number(e.target.value))}
            style={{
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #000",
            }}
          >
            <option value={1}>1 variant</option>
            <option value={2}>2 variants</option>
            <option value={3}>3 variants</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleGenerateVariants}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              border: "2px solid #000",
              background: loading ? "#ccc" : "#fff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate Variants"}
          </button>
          <button
            onClick={handleAutoGenerate}
            disabled={loading || isGeneratingPrompt}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              border: "1px solid #000",
              background: loading || isGeneratingPrompt ? "#ccc" : "#fff",
              cursor: loading || isGeneratingPrompt ? "not-allowed" : "pointer",
            }}
          >
            {isGeneratingPrompt
              ? "🤖 AI Thinking..."
              : "🤖 Auto-Generate with AI"}
          </button>
        </div>

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
      </div>

      {/* Variants List */}
      <div style={{ padding: "15px", border: "1px solid #ccc" }}>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: 0,
            marginBottom: "15px",
          }}
        >
          Active Variants ({variants.length})
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {variants.map((variant) => (
            <div
              key={variant.id}
              style={{
                padding: "15px",
                border:
                  currentVariant.id === variant.id
                    ? "2px solid #000"
                    : "1px solid #ccc",
                background:
                  currentVariant.id === variant.id ? "#f5f5f5" : "#fff",
                cursor: "pointer",
                opacity: variant.isActive ? 1 : 0.5,
              }}
              onClick={() => onVariantChange(variant)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "14px" }}>{variant.name}</strong>
                    {currentVariant.id === variant.id && (
                      <span style={{ marginLeft: "10px", fontSize: "12px" }}>
                        [CURRENT]
                      </span>
                    )}
                    <span style={{ marginLeft: "10px", fontSize: "12px" }}>
                      [{variant.isActive ? "Active" : "Inactive"}]
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", margin: "0 0 8px 0" }}>
                    {variant.description}
                  </p>
                  {variant.metrics && (
                    <div style={{ fontSize: "12px" }}>
                      CTR: {variant.metrics.clickThroughRate.toFixed(2)}% |
                      Conv: {variant.metrics.conversionRate.toFixed(2)}%
                    </div>
                  )}
                </div>
                <div
                  style={{ display: "flex", gap: "5px", marginLeft: "15px" }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVariant(variant);
                    }}
                    style={{
                      padding: "5px 10px",
                      fontSize: "12px",
                      border: "1px solid #000",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {variant.isActive ? "Deactivate" : "Activate"}
                  </button>
                  {variant.id !== "original" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVariant(variant.id);
                      }}
                      style={{
                        padding: "5px 10px",
                        fontSize: "12px",
                        border: "1px solid #000",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statsig Experiment Management */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "2px solid #000",
          background: "#f8f9fa",
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
          🔬 Statsig Experiment Management
        </h3>
        <p style={{ fontSize: "14px", marginBottom: "15px", color: "#666" }}>
          Create experiments in Statsig for your variants to track performance and get detailed analytics.
        </p>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={async () => {
              if (variants.length < 2) {
                setMessage("You need at least 2 variants to create an experiment");
                return;
              }
              
              setLoading(true);
              setMessage("Creating Statsig experiment...");
              
              try {
                const response = await axios.post("/api/experiments/create", {
                  type: "multiple",
                  variants: variants.filter(v => v.isActive),
                  originalVariantId: "original"
                });
                
                if (response.data.success) {
                  setMessage(`✅ Experiment "${response.data.experiment.name}" created successfully!`);
                } else {
                  setMessage("❌ Failed to create experiment");
                }
              } catch (error: any) {
                console.error("Error creating experiment:", error);
                setMessage(error.response?.data?.error || "Failed to create experiment");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || variants.length < 2}
            style={{
              padding: "10px 20px",
              border: "2px solid #000",
              background: variants.length >= 2 ? "#000" : "#ccc",
              color: variants.length >= 2 ? "#fff" : "#666",
              cursor: variants.length >= 2 ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Create Experiment for All Variants
          </button>
          
          <a
            href="https://console.statsig.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 20px",
              border: "1px solid #000",
              background: "#fff",
              color: "#000",
              textDecoration: "none",
              fontSize: "14px",
              display: "inline-block",
            }}
          >
            View Statsig Console →
          </a>
        </div>
        
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
          <p><strong>Note:</strong> Experiments are automatically created when you generate new variants.</p>
          <p><strong>Requirements:</strong> STATSIG_CONSOLE_API_KEY must be configured in your environment variables.</p>
        </div>
      </div>
    </div>
  );
}
