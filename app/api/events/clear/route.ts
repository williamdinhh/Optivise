import { NextResponse } from "next/server";
import { clearEvents } from "@/lib/event-tracker";

export async function POST() {
  try {
    clearEvents();
    return NextResponse.json({
      success: true,
      message: "All event data has been cleared",
    });
  } catch (error) {
    console.error("Error clearing events:", error);
    return NextResponse.json(
      { error: "Failed to clear events" },
      { status: 500 }
    );
  }
}
