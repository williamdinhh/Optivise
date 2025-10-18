import { NextRequest, NextResponse } from 'next/server';
import { getActiveVariants, updateVariant } from '@/lib/storage';
import { simulateUserData } from '@/lib/simulator';

export async function POST(request: NextRequest) {
  try {
    const variants = getActiveVariants();

    if (variants.length === 0) {
      return NextResponse.json({ error: 'No active variants to simulate' }, { status: 400 });
    }

    // Simulate data for each variant
    const results = variants.map((variant, index) => {
      const metrics = simulateUserData(index, variants.length);
      
      // Update variant with metrics
      updateVariant(variant.id, { metrics });

      return {
        variantId: variant.id,
        name: variant.name,
        metrics,
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error simulating data:', error);
    return NextResponse.json({ error: 'Failed to simulate data' }, { status: 500 });
  }
}

