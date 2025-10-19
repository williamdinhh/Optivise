import { NextRequest, NextResponse } from "next/server";
import { getAllVariants } from "@/lib/storage";
import { getRealStatsigMetrics } from "@/lib/statsig-api";
import { aggregateEventsToMetrics } from "@/lib/event-tracker";

export async function GET(request: NextRequest) {
  try {
    const variants = getAllVariants().filter((v) => v.isActive);

    if (variants.length === 0) {
      return NextResponse.json(
        { error: "No active variants found" },
        { status: 400 }
      );
    }

    // FIRST: Try local event tracking (most reliable for demo)
    const variantIds = variants.map((v) => v.id);
    const localMetrics = aggregateEventsToMetrics(variantIds);

    if (localMetrics && localMetrics.eventCount > 0) {
      console.log("✅ Using locally tracked events (REAL clicks!)");
      console.log(`📊 Total events tracked: ${localMetrics.eventCount}`);

      return NextResponse.json({
        metrics: localMetrics.metrics,
        variants: variants.map((v) => ({ id: v.id, name: v.name })),
        timestamp: localMetrics.timestamp,
        eventCount: localMetrics.eventCount,
        source: "local_events_real",
      });
    }

    // SECOND: Try to fetch real metrics from Statsig Console API
    const realMetrics = await getRealStatsigMetrics();

    if (
      realMetrics &&
      realMetrics.metrics &&
      Object.keys(realMetrics.metrics).length > 0
    ) {
      // We have real data from Statsig!
      console.log("✅ Using real Statsig metrics");

      return NextResponse.json({
        metrics: realMetrics.metrics,
        variants: variants.map((v) => ({ id: v.id, name: v.name })),
        timestamp: realMetrics.timestamp,
        eventCount: realMetrics.eventCount,
        source: "statsig_console_api_real",
      });
    }

    // Fallback: If no real data yet, use simulated metrics
    console.warn(
      "⚠️  No real Statsig data available yet. Using simulated metrics."
    );
    console.log("💡 Make sure:");
    console.log("   1. STATSIG_CONSOLE_KEY is set in .env.local");
    console.log("   2. Event capture is running");
    console.log("   3. Users have interacted with variants");

    const metricsMap: { [key: string]: any } = {};

    variants.forEach((variant, index) => {
      const baseRate = 3 + index * 0.5;
      metricsMap[variant.id] = {
        impressions: Math.floor(100 + Math.random() * 50),
        clicks: Math.floor(10 + Math.random() * 20),
        clickThroughRate: baseRate + Math.random() * 2,
        conversions: Math.floor(2 + Math.random() * 5),
        conversionRate: baseRate / 2 + Math.random(),
        avgTimeOnPage: 0, // Not tracked
        bounceRate: 0, // Not tracked
        source: "simulated_fallback",
      };
    });

    return NextResponse.json({
      metrics: metricsMap,
      variants: variants.map((v) => ({ id: v.id, name: v.name })),
      timestamp: new Date().toISOString(),
      source: "simulated_fallback",
      warning:
        "Using simulated data. Set STATSIG_CONSOLE_KEY to use real metrics.",
    });
  } catch (error) {
    console.error("Error fetching Statsig metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
