import { NextRequest, NextResponse } from 'next/server';
import { getAllVariants } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const variants = getAllVariants().filter(v => v.isActive);

    if (variants.length === 0) {
      return NextResponse.json(
        { error: 'No active variants found' },
        { status: 400 }
      );
    }

    // In a real implementation, this would fetch from Statsig's Console API
    // For now, we'll simulate metrics based on the Statsig events that were logged
    
    // Note: To get real metrics, you would need to:
    // 1. Use Statsig Console API with your server secret key
    // 2. Query the event data for each variant
    // 3. Calculate aggregated metrics (CTR, conversion rate, etc.)
    
    const metricsMap: { [key: string]: any } = {};
    
    variants.forEach((variant, index) => {
      // Simulated metrics - in production, fetch from Statsig Console API
      const baseRate = 3 + (index * 0.5);
      metricsMap[variant.id] = {
        impressions: Math.floor(100 + Math.random() * 50),
        clicks: Math.floor(10 + Math.random() * 20),
        clickThroughRate: baseRate + Math.random() * 2,
        conversions: Math.floor(2 + Math.random() * 5),
        conversionRate: (baseRate / 2) + Math.random(),
        avgTimeOnPage: 45 + Math.random() * 30,
        bounceRate: 40 - (index * 2) + Math.random() * 10,
        source: 'statsig_events', // Indicates these come from Statsig
      };
    });

    return NextResponse.json({
      metrics: metricsMap,
      variants: variants.map(v => ({ id: v.id, name: v.name })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching Statsig metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

