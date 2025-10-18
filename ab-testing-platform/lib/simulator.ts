import { VariantMetrics } from '@/types';

/**
 * Simulates user interaction data for a variant
 * Returns realistic metrics with some randomness to differentiate variants
 */
export function simulateUserData(variantIndex: number, totalVariants: number): VariantMetrics {
  // Base metrics with some randomness
  const baseImpressions = 1000 + Math.floor(Math.random() * 500);
  
  // Create variation based on variant index to make results differ
  // Later variants generally perform slightly better (simulating A/B test results)
  const performanceMultiplier = 1 + (variantIndex * 0.15) + (Math.random() * 0.1 - 0.05);
  
  // Click-through rate (2-8%)
  const baseCTR = 3 + Math.random() * 3;
  const ctr = Math.min(baseCTR * performanceMultiplier, 12);
  const clicks = Math.floor(baseImpressions * (ctr / 100));
  
  // Conversion rate (1-5% of clicks)
  const baseConversionRate = 2 + Math.random() * 2;
  const conversionRate = Math.min(baseConversionRate * performanceMultiplier, 8);
  const conversions = Math.floor(clicks * (conversionRate / 100));
  
  // Time on page (30-120 seconds)
  const baseTime = 45 + Math.random() * 45;
  const avgTimeOnPage = baseTime * performanceMultiplier;
  
  // Bounce rate (30-70%, inverse of performance)
  const baseBounceRate = 55 - Math.random() * 20;
  const bounceRate = Math.max(baseBounceRate / performanceMultiplier, 20);
  
  return {
    impressions: baseImpressions,
    clicks,
    clickThroughRate: ctr,
    avgTimeOnPage: Math.round(avgTimeOnPage * 10) / 10,
    bounceRate: Math.round(bounceRate * 100) / 100,
    conversions,
    conversionRate: Math.round(conversionRate * 100) / 100,
  };
}

/**
 * Simulate data for all active variants
 */
export function simulateAllVariants(variantIds: string[]): Map<string, VariantMetrics> {
  const results = new Map<string, VariantMetrics>();
  
  variantIds.forEach((id, index) => {
    results.set(id, simulateUserData(index, variantIds.length));
  });
  
  return results;
}

