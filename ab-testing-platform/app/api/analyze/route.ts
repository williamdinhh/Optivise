import { NextRequest, NextResponse } from 'next/server';
import { getAllVariants } from '@/lib/storage';
import { analyzeVariants } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const variants = getAllVariants().filter(v => v.isActive && v.metrics);

    if (variants.length === 0) {
      return NextResponse.json(
        { error: 'No variants with metrics available for analysis' },
        { status: 400 }
      );
    }

    // Prepare data for analysis
    const variantsForAnalysis = variants.map(v => ({
      id: v.id,
      name: v.name,
      metrics: v.metrics!,
    }));

    // Get AI analysis
    const analysis = await analyzeVariants(variantsForAnalysis);

    // Include full metrics in response
    const metricsMap: { [key: string]: any } = {};
    variants.forEach(v => {
      metricsMap[v.id] = v.metrics;
    });

    return NextResponse.json({
      ...analysis,
      metrics: metricsMap,
      variants: variants.map(v => ({ id: v.id, name: v.name })),
    });
  } catch (error) {
    console.error('Error analyzing variants:', error);
    return NextResponse.json(
      { error: 'Failed to analyze variants', details: (error as Error).message },
      { status: 500 }
    );
  }
}

