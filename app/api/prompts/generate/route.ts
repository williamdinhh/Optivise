import { NextRequest, NextResponse } from "next/server";
import { generateOptimizationPrompt } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { currentHtml, currentCss } = await request.json();

    if (!currentHtml || !currentCss) {
      return NextResponse.json(
        { error: "HTML and CSS are required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Generate optimization prompt using AI
    const prompt = await generateOptimizationPrompt(currentHtml, currentCss);

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json(
      {
        error: "Failed to generate prompt",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
