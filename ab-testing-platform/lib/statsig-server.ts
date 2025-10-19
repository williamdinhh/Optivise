import { Statsig } from 'statsig-node';

let initialized = false;

export async function initializeStatsig() {
  if (!initialized && process.env.STATSIG_SERVER_KEY) {
    await Statsig.initialize(process.env.STATSIG_SERVER_KEY);
    initialized = true;
  }
}

export async function createExperiment(experimentName: string, variants: string[]) {
  await initializeStatsig();
  
  // Note: Statsig experiments are typically created through the Statsig Console
  // This function would use the Statsig API to programmatically create experiments
  // For now, we'll return the experiment configuration
  return {
    experimentName,
    variants,
    created: true,
  };
}

export async function getExperimentMetrics(experimentName: string) {
  await initializeStatsig();
  
  // Fetch metrics from Statsig
  // This would use Statsig's Console API to get experiment results
  try {
    // Placeholder - in production, use Statsig Console API
    return {
      experiment: experimentName,
      metrics: {},
      status: 'running',
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

export { Statsig };

