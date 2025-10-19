import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HISTORY_FILE = path.join(process.cwd(), "data", "history.json");

interface HistoryEntry {
  id: string;
  type: "analysis" | "variant";
  timestamp: string;
  data: any;
}

function getHistory(): HistoryEntry[] {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
}

function saveHistory(history: HistoryEntry[]): void {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error("Error saving history:", error);
  }
}

// GET: Retrieve history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'analysis' or 'variant' or null for all
    const limit = parseInt(searchParams.get("limit") || "50");

    let history = getHistory();

    if (type) {
      history = history.filter((entry) => entry.type === type);
    }

    // Sort by timestamp descending (newest first)
    history.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    history = history.slice(0, limit);

    return NextResponse.json({
      history,
      total: history.length,
    });
  } catch (error) {
    console.error("Error getting history:", error);
    return NextResponse.json(
      { error: "Failed to get history" },
      { status: 500 }
    );
  }
}

// POST: Add a new history entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing type or data" },
        { status: 400 }
      );
    }

    const history = getHistory();
    const newEntry: HistoryEntry = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      data,
    };

    history.push(newEntry);

    // Keep only last 100 entries
    const recentHistory = history.slice(-100);
    saveHistory(recentHistory);

    return NextResponse.json({
      success: true,
      entry: newEntry,
    });
  } catch (error) {
    console.error("Error adding history entry:", error);
    return NextResponse.json(
      { error: "Failed to add history entry" },
      { status: 500 }
    );
  }
}

// DELETE: Clear history
export async function DELETE() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      fs.unlinkSync(HISTORY_FILE);
    }
    return NextResponse.json({
      success: true,
      message: "History cleared",
    });
  } catch (error) {
    console.error("Error clearing history:", error);
    return NextResponse.json(
      { error: "Failed to clear history" },
      { status: 500 }
    );
  }
}
