"use client";

import { ReactNode, useEffect } from "react";
import {
  StatsigProvider as StatsigReactProvider,
  useClientAsyncInit,
} from "@statsig/react-bindings";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";

interface StatsigProviderWrapperProps {
  children: ReactNode;
  userID?: string;
}

export default function StatsigProvider({
  children,
  userID = "anonymous-user",
}: StatsigProviderWrapperProps) {
  const { client } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || "",
    { userID },
    {
      plugins: [
        new StatsigAutoCapturePlugin(),
        new StatsigSessionReplayPlugin(),
      ],
      // Add error handling for network issues
      environment: { tier: "development" },
    }
  );

  useEffect(() => {
    if (client) {
      console.log("✅ Statsig Client Initialized:", {
        userID,
        sdkKey:
          process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY?.substring(0, 20) + "...",
      });

      // Log a test event to verify connection
      try {
        client.logEvent("statsig_initialized", "test", {
          timestamp: Date.now().toString(),
          userID,
        });
        console.log("📡 Test event sent to Statsig");
      } catch (error) {
        console.warn("⚠️  Statsig event logging error (non-critical):", error);
      }
    }
  }, [client, userID]);

  // Suppress Statsig network error messages in console
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      // Filter out Statsig registry network errors
      if (
        args.some(
          (arg) =>
            typeof arg === "string" &&
            (arg.includes("prodregistryv2.org") || arg.includes("[Statsig]"))
        )
      ) {
        // Silently ignore Statsig registry errors
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <StatsigReactProvider
      client={client}
      loadingComponent={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading Statsig...</div>
        </div>
      }
    >
      {children}
    </StatsigReactProvider>
  );
}
