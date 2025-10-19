import { NextRequest, NextResponse } from 'next/server';
import { createStatsigExperiment, createExperimentForVariant, createExperimentForVariants } from '@/lib/statsig-experiments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, variantData, variants } = body;

    console.log('🔬 Experiment creation request:', { type, variantData, variants });

    if (!process.env.STATSIG_CONSOLE_API_KEY) {
      console.warn('⚠️  STATSIG_CONSOLE_API_KEY not configured');
      return NextResponse.json(
        { error: 'Statsig Console API key not configured' },
        { status: 500 }
      );
    }

    let experimentData;
    let experimentResult;

    if (type === 'single' && variantData) {
      // Create experiment for a single variant
      console.log('🔬 Creating single variant experiment for:', variantData.name);
      experimentData = createExperimentForVariant(
        variantData.name,
        variantData.description,
        variantData.id,
        variantData.originalVariantId || 'original'
      );
    } else if (type === 'multiple' && variants && Array.isArray(variants)) {
      // Create experiment for multiple variants
      console.log('🔬 Creating multiple variant experiment for:', variants.length, 'variants');
      console.log('📊 Variants data:', variants.map(v => ({ id: v.id, name: v.name, description: v.description })));
      
      // Validate variant structure
      const validVariants = variants.filter(v => v.id && v.name && v.description);
      if (validVariants.length === 0) {
        return NextResponse.json(
          { error: 'No valid variants provided. Variants must have id, name, and description.' },
          { status: 400 }
        );
      }
      
      experimentData = createExperimentForVariants(
        validVariants,
        body.originalVariantId || 'original'
      );
    } else {
      console.error('❌ Invalid request structure:', { type, hasVariantData: !!variantData, hasVariants: !!variants, variantsIsArray: Array.isArray(variants) });
      return NextResponse.json(
        { error: 'Invalid request. Provide either single variant or multiple variants.' },
        { status: 400 }
      );
    }

    // Create the experiment in Statsig
    experimentResult = await createStatsigExperiment(experimentData);

    if (!experimentResult) {
      return NextResponse.json(
        { error: 'Failed to create experiment in Statsig' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      experiment: experimentResult.data,
      message: `Experiment "${experimentResult.data.name}" created successfully in Statsig`,
    });
  } catch (error) {
    console.error('Error creating experiment:', error);
    return NextResponse.json(
      { error: 'Failed to create experiment', details: (error as Error).message },
      { status: 500 }
    );
  }
}
