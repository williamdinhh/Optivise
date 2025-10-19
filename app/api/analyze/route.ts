import { NextRequest, NextResponse } from 'next/server';
import { getAllVariants } from '@/lib/storage';
import { analyzeVariants } from '@/lib/ai';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Analyze endpoint called');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini API key not configured');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    console.log('✅ Gemini API key is configured');
    console.log('🔑 API Key starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');

    // Fetch real-time metrics from Statsig instead of using stored synthetic data
    const baseUrl = request.nextUrl.origin;
    console.log('📊 Fetching metrics from:', `${baseUrl}/api/statsig/metrics`);
    
    const metricsResponse = await axios.get(`${baseUrl}/api/statsig/metrics`);
    console.log('📊 Metrics response status:', metricsResponse.status);
    console.log('📊 Metrics response data:', metricsResponse.data);
    
    const { metrics: metricsMap, variants: variantsList, source, warning } = metricsResponse.data;

    if (!variantsList || variantsList.length === 0) {
      console.warn('⚠️  No variants with metrics available for analysis');
      return NextResponse.json(
        { error: 'No variants with metrics available for analysis' },
        { status: 400 }
      );
    }

    console.log('📊 Found variants for analysis:', variantsList.length);

    // Prepare data for AI analysis using Statsig metrics
    const variantsForAnalysis = variantsList.map((v: any) => ({
      id: v.id,
      name: v.name,
      metrics: metricsMap[v.id],
    }));

    console.log('🤖 Starting AI analysis...');
    // Get AI analysis based on real Statsig data
    const analysis = await analyzeVariants(variantsForAnalysis);
    console.log('✅ AI analysis completed');

    return NextResponse.json({
      ...analysis,
      metrics: metricsMap,
      variants: variantsList,
      source: source, // Pass through the source from statsig/metrics endpoint
      warning: warning, // Pass through any warnings
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error analyzing variants:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('📄 Error message:', error.message);
      console.error('📄 Error stack:', error.stack);
    }
    
    // Check if it's an axios error
    if (axios.isAxiosError(error)) {
      console.error('📡 Axios error status:', error.response?.status);
      console.error('📡 Axios error data:', error.response?.data);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze variants', 
        details: (error as Error).message,
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    );
  }
}

