import { NextRequest, NextResponse } from "next/server";
import { generateVariants } from "@/lib/ai";
import { addVariant } from "@/lib/storage";
import { Variant } from "@/types";
import { createStatsigExperiment, createExperimentForVariants } from "@/lib/statsig-experiments";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      currentHtml,
      currentCss,
      variantCount = 2,
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Generate variants using AI
    const generatedVariants = await generateVariants(
      prompt,
      currentHtml,
      currentCss,
      variantCount
    );

    // Save variants to storage
    const savedVariants: Variant[] = [];
    for (const gv of generatedVariants) {
      const variant: Variant = {
        id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: gv.name,
        description: gv.description,
        html: gv.html,
        css: gv.css,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      addVariant(variant);
      savedVariants.push(variant);

      // Save to history
      const baseUrl = request.nextUrl.origin;
      try {
        await axios.post(`${baseUrl}/api/history`, {
          type: "variant",
          data: {
            ...variant,
            prompt,
          },
        });
      } catch (historyError) {
        console.error("Failed to save variant to history:", historyError);
        // Don't fail the entire request if history save fails
      }
    }

    // Create Statsig experiment for the new variants
    let experimentResult = null;
    if (process.env.STATSIG_CONSOLE_API_KEY && savedVariants.length > 0) {
      try {
        console.log("🔬 Creating Statsig experiment for new variants...");
        
        const experimentData = createExperimentForVariants(savedVariants);
        experimentResult = await createStatsigExperiment(experimentData);
        
        if (experimentResult) {
          console.log("✅ Statsig experiment created:", experimentResult.data.id);
        } else {
          console.warn("⚠️  Failed to create Statsig experiment");
        }
      } catch (experimentError) {
        console.error("❌ Error creating Statsig experiment:", experimentError);
        // Don't fail the entire request if experiment creation fails
      }
    } else if (!process.env.STATSIG_CONSOLE_API_KEY) {
      console.log("ℹ️  STATSIG_CONSOLE_API_KEY not set - skipping experiment creation");
    }

    return NextResponse.json({ 
      variants: savedVariants,
      experiment: experimentResult?.data || null,
      experimentCreated: !!experimentResult
    });
  } catch (error) {
    console.error("Error generating variants:", error);
    return NextResponse.json(
      {
        error: "Failed to generate variants",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
