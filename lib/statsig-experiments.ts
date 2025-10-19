/**
 * Statsig Experiment Management
 * Creates and manages experiments in Statsig when variants are generated
 */

interface StatsigExperimentRequest {
  name: string;
  description: string;
  hypothesis: string;
  groups: Array<{
    name: string;
    size: number;
    parameterValues: Record<string, any>;
    description?: string;
  }>;
  primaryMetrics?: Array<{
    name: string;
    type: string;
    direction?: 'increase' | 'decrease';
  }>;
  duration?: number;
  allocation?: number;
  idType?: string;
  status?: string;
}

interface StatsigExperimentResponse {
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    status: string;
    groups: Array<{
      name: string;
      id: string;
      size: number;
      parameterValues: Record<string, any>;
    }>;
    primaryMetrics: Array<{
      name: string;
      type: string;
    }>;
  };
}

/**
 * Create a new experiment in Statsig
 */
export async function createStatsigExperiment(
  experimentData: StatsigExperimentRequest
): Promise<StatsigExperimentResponse | null> {
  const consoleKey = process.env.STATSIG_CONSOLE_API_KEY;
  
  if (!consoleKey) {
    console.warn('⚠️  STATSIG_CONSOLE_API_KEY not set - cannot create experiment');
    return null;
  }

  try {
    console.log('🔬 Creating Statsig experiment:', experimentData.name);
    console.log('🔑 Using Console Key:', consoleKey.substring(0, 20) + '...');
    
    const url = 'https://statsigapi.net/console/v1/experiments';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'STATSIG-API-KEY': consoleKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experimentData),
    });

    console.log('📡 Statsig API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Statsig experiment creation failed:', response.status, response.statusText);
      console.error('📄 Error details:', errorText);
      return null;
    }

    const result: StatsigExperimentResponse = await response.json();
    console.log('✅ Statsig experiment created successfully:', result.data.id);
    return result;
  } catch (error) {
    console.error('❌ Error creating Statsig experiment:', error);
    if (error instanceof Error) {
      console.error('📄 Error details:', error.message);
    }
    return null;
  }
}

/**
 * Create experiment data for a new variant
 */
export function createExperimentForVariant(
  variantName: string,
  variantDescription: string,
  variantId: string,
  originalVariantId: string = 'original'
): StatsigExperimentRequest {
  // Generate a unique experiment name
  const experimentName = `ab_test_${variantId}_${Date.now()}`;
  
  // Create hypothesis based on variant description
  const hypothesis = `Testing ${variantName}: ${variantDescription}`;
  
  // Create groups - Control (original) and Test (new variant)
  const groups = [
    {
      name: 'Control',
      size: 50,
      parameterValues: {
        variant_id: originalVariantId,
        assigned_group: 'control',
      },
      description: 'Original variant (control group)',
    },
    {
      name: 'Test',
      size: 50,
      parameterValues: {
        variant_id: variantId,
        assigned_group: 'test',
      },
      description: `New variant: ${variantName}`,
    },
  ];

  // Create experiment without predefined metrics
  // Metrics can be added later in the Statsig Console
  return {
    name: experimentName,
    description: `A/B test comparing original variant with ${variantName}`,
    hypothesis,
    groups,
    duration: 14, // 14 days
    allocation: 100, // 100% allocation
    idType: 'userID', // Required field
    status: 'setup', // Initial status
  };
}

/**
 * Create experiment for multiple variants (A/B/C test)
 */
export function createExperimentForVariants(
  variants: Array<{ id: string; name: string; description: string }>,
  originalVariantId: string = 'original'
): StatsigExperimentRequest {
  console.log('🔬 Creating experiment for variants:', variants);
  console.log('🔬 Original variant ID:', originalVariantId);
  
  const variantNames = variants.map(v => v.name).join(', ');
  const experimentName = `ab_test_multiple_${Date.now()}`;
  
  console.log('🔬 Experiment name:', experimentName);
  console.log('🔬 Variant names:', variantNames);
  
  // Create hypothesis
  const hypothesis = `Testing multiple variants: ${variantNames}`;
  
  // Create groups - Control + all variants
  const totalVariants = variants.length + 1; // +1 for control
  const groupSize = Math.floor(100 / totalVariants);
  const remainder = 100 - (groupSize * totalVariants);
  
  console.log('🔬 Total variants:', totalVariants, 'Group size:', groupSize, 'Remainder:', remainder);
  
  const groups = [
    {
      name: 'Control',
      size: groupSize + remainder, // Give remainder to control
      parameterValues: {
        variant_id: originalVariantId,
        assigned_group: 'control',
      },
      description: 'Original variant (control group)',
    },
    ...variants.map((variant, index) => ({
      name: `Variant ${index + 1}`,
      size: groupSize,
      parameterValues: {
        variant_id: variant.id,
        assigned_group: `variant_${index + 1}`,
      },
      description: variant.name,
    })),
  ];

  // Create experiment without predefined metrics
  // Metrics can be added later in the Statsig Console
  const experimentData = {
    name: experimentName,
    description: `A/B/C test comparing original variant with ${variantNames}`,
    hypothesis,
    groups,
    duration: 14,
    allocation: 100,
    idType: 'userID', // Required field
    status: 'setup', // Initial status
  };
  
  console.log('🔬 Final experiment data:', JSON.stringify(experimentData, null, 2));
  return experimentData;
}
