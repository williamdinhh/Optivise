import { NextResponse } from "next/server";
import { getStoredEvents } from "@/lib/event-tracker";

export async function GET() {
  try {
    const events = getStoredEvents();

    return NextResponse.json({
      events,
      totalEvents: events.length,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error exporting events:", error);
    return NextResponse.json(
      { error: "Failed to export events" },
      { status: 500 }
    );
  }
}
