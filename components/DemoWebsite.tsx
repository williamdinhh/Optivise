"use client";

import { useEffect, useRef } from "react";
import { useStatsigClient } from "@statsig/react-bindings";
import axios from "axios";

interface DemoWebsiteProps {
  html: string;
  css: string;
  variantId: string;
  captureEnabled?: boolean;
  showRecordingBadge?: boolean; // Show the recording badge in dashboard mode
}

// Helper function to log events to both Statsig and local tracker
async function logDualEvent(
  client: any,
  eventName: string,
  variantId: string,
  metadata: Record<string, any>
) {
  // Log to Statsig
  if (client) {
    client.logEvent(
      eventName,
      metadata.button_text || metadata.element_text || variantId,
      metadata
    );
  }

  // Log to local tracker
  try {
    await axios.post("/api/events/log", {
      eventName,
      variantId,
      metadata,
    });
  } catch (error) {
    console.error("Error logging to local tracker:", error);
  }

  console.log("📊 Event logged:", eventName, metadata);
}

export default function DemoWebsite({
  html,
  css,
  variantId,
  captureEnabled = false,
  showRecordingBadge = true,
}: DemoWebsiteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const { client } = useStatsigClient();

  useEffect(() => {
    if (!containerRef.current) return;

    // Get or create shadow root
    if (!shadowRootRef.current) {
      if (containerRef.current.shadowRoot) {
        shadowRootRef.current = containerRef.current.shadowRoot;
      } else {
        shadowRootRef.current = containerRef.current.attachShadow({
          mode: "open",
        });
      }
    }

    const shadowRoot = shadowRootRef.current;
    if (!shadowRoot) return;

    // Create style element
    const style = document.createElement("style");
    style.textContent = css;

    // Create content container
    const content = document.createElement("div");
    content.innerHTML = html;
    content.style.fontFamily = "system-ui, -apple-system, sans-serif";

    // Clear and update shadow root
    shadowRoot.innerHTML = "";
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(content);

    // Log impression if capture is enabled
    if (captureEnabled && client) {
      logDualEvent(client, "variant_impression", variantId, {
        variant_id: variantId,
        timestamp: Date.now(),
      });
    }

    // Track all clickable elements (links, buttons, etc)
    const allClickables = shadowRoot.querySelectorAll("a, button, [onclick]");
    console.log(
      `🎯 Setting up click tracking for ${
        allClickables.length
      } elements. CaptureEnabled: ${captureEnabled}, Client: ${!!client}`
    );

    allClickables.forEach((element, index) => {
      element.addEventListener("click", (e) => {
        const elementType = element.tagName.toLowerCase();
        const elementText = element.textContent || "";

        console.log(`🖱️ Click detected: ${elementType} - "${elementText}"`);
        console.log(
          `   CaptureEnabled: ${captureEnabled}, Client initialized: ${!!client}`
        );

        // Track click event if capture is enabled
        if (captureEnabled && client) {
          // Determine event name based on element type
          const eventName =
            elementType === "button" ? "button_click" : "element_click";

          const eventData = {
            variant_id: variantId,
            element_type: elementType,
            element_text: elementText,
            element_index: index,
            timestamp: Date.now(),
          };

          // Add button-specific data if it's a button
          if (elementType === "button") {
            eventData.button_text = elementText;
            eventData.button_index = index;
          }

          console.log(`   ✅ Logging ${eventName} event`);
          logDualEvent(client, eventName, variantId, eventData);
        } else {
          console.log(
            `   ⚠️ Click NOT tracked - captureEnabled: ${captureEnabled}, client: ${!!client}`
          );
        }
      });
    });
  }, [html, css, variantId, captureEnabled, client]);

  return (
    <div
      className={
        showRecordingBadge ? "bg-gray-100 p-6 rounded-lg relative" : "relative"
      }
    >
      {captureEnabled && showRecordingBadge && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="animate-pulse mr-2">●</span>
            Recording
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className={
          showRecordingBadge
            ? "bg-white rounded-lg shadow-lg overflow-hidden"
            : ""
        }
      ></div>
    </div>
  );
}
