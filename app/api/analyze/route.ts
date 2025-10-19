import { NextRequest, NextResponse } from 'next/server';
import { getAllVariants } from '@/lib/vercel-storage';
import { analyzeVariants } from '@/lib/ai';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Fetch real-time metrics from Statsig instead of using stored synthetic data
    const baseUrl = request.nextUrl.origin;
    const metricsResponse = await axios.get(`${baseUrl}/api/statsig/metrics`);
    const { metrics: metricsMap, variants: variantsList, source, warning } = metricsResponse.data;

    if (!variantsList || variantsList.length === 0) {
      return NextResponse.json(
        { error: 'No variants with metrics available for analysis' },
        { status: 400 }
      );
    }

    // Prepare data for AI analysis using Statsig metrics
    const variantsForAnalysis = variantsList.map((v: any) => ({
      id: v.id,
      name: v.name,
      metrics: metricsMap[v.id],
    }));

    // Get AI analysis based on real Statsig data
    const analysis = await analyzeVariants(variantsForAnalysis);

    return NextResponse.json({
      ...analysis,
      metrics: metricsMap,
      variants: variantsList,
      source: source, // Pass through the source from statsig/metrics endpoint
      warning: warning, // Pass through any warnings
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error analyzing variants:', error);
    return NextResponse.json(
      { error: 'Failed to analyze variants', details: (error as Error).message },
      { status: 500 }
    );
  }
}

