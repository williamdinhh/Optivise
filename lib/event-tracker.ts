/**
 * Local Event Tracker
 * Stores events locally for analysis while also sending to Statsig
 */

// In-memory storage (resets on each serverless function invocation)
let memoryEvents: TrackedEvent[] = [];

export interface TrackedEvent {
  eventName: string;
  variantId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Read all stored events
 */
export function getStoredEvents(): TrackedEvent[] {
  return memoryEvents;
}

/**
 * Store a new event
 */
export function storeEvent(event: TrackedEvent) {
  try {
    memoryEvents.push(event);

    // Keep only last 10,000 events to prevent memory from growing too large
    if (memoryEvents.length > 10000) {
      memoryEvents = memoryEvents.slice(-10000);
    }

    console.log(
      `📊 Event stored: ${event.eventName} for variant ${event.variantId}`
    );
  } catch (error) {
    console.error("Error storing event:", error);
  }
}

/**
 * Clear all stored events
 */
export function clearEvents() {
  memoryEvents = [];
  console.log("🗑️ All events cleared");
}

/**
 * Aggregate events into metrics by variant
 */
export function aggregateEventsToMetrics(variantIds: string[]) {
  const events = getStoredEvents();

  if (events.length === 0) {
    return null;
  }

  const metricsMap: Record<string, any> = {};

  variantIds.forEach((variantId) => {
    const variantEvents = events.filter((e) => e.variantId === variantId);

    const impressions = variantEvents.filter(
      (e) => e.eventName === "variant_impression"
    ).length;
    const clicks = variantEvents.filter(
      (e) => e.eventName === "button_click" || e.eventName === "element_click"
    ).length;
    const conversions = variantEvents.filter(
      (e) => e.eventName === "conversion"
    ).length;
    const bounces = variantEvents.filter(
      (e) => e.eventName === "page_bounce"
    ).length;

    // Calculate average time on page from click events
    const clickEvents = variantEvents.filter(
      (e) => e.eventName === "button_click" || e.eventName === "element_click"
    );
    const totalTime = clickEvents.reduce((sum, event) => {
      return sum + (event.metadata?.time_on_page || 0);
    }, 0);
    const avgTimeOnPage =
      clickEvents.length > 0 ? totalTime / clickEvents.length / 1000 : 0; // Convert to seconds

    // Calculate bounce rate: impressions that resulted in bounces
    const bounceRate = impressions > 0 ? (bounces / impressions) * 100 : 0;

    metricsMap[variantId] = {
      impressions,
      clicks,
      clickThroughRate: impressions > 0 ? (clicks / impressions) * 100 : 0,
      conversions,
      conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      avgTimeOnPage: Math.round(avgTimeOnPage * 10) / 10, // Round to 1 decimal
      bounceRate: Math.round(bounceRate * 10) / 10, // Round to 1 decimal
      source: "local_events_real",
    };
  });

  return {
    metrics: metricsMap,
    eventCount: events.length,
    timestamp: new Date().toISOString(),
    source: "local_events_real",
  };
}
