#!/usr/bin/env node

import inquirer from 'inquirer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const API_BASE = 'http://localhost:3000';

interface VariantMetrics {
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
}

interface AnalysisResult {
  winner: string | null;
  summary: string;
  insights: string[];
  recommendations: string[];
  metrics: {
    [variantId: string]: VariantMetrics;
  };
  variants: Array<{ id: string; name: string }>;
}

// ASCII Art Header
function printHeader() {
  console.clear();
  console.log('\x1b[36m%s\x1b[0m', '╔══════════════════════════════════════════════════════════╗');
  console.log('\x1b[36m%s\x1b[0m', '║                                                          ║');
  console.log('\x1b[36m%s\x1b[0m', '║       AI-Powered A/B Testing Analytics Dashboard         ║');
  console.log('\x1b[36m%s\x1b[0m', '║                                                          ║');
  console.log('\x1b[36m%s\x1b[0m', '╚══════════════════════════════════════════════════════════╝');
  console.log();
}

// Create ASCII bar chart
function createBarChart(label: string, value: number, maxValue: number, unit: string = '%') {
  const barLength = 40;
  const filledLength = Math.round((value / maxValue) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  return `${label.padEnd(20)} │ ${bar} │ ${value.toFixed(2)}${unit}`;
}

// Print metrics table
function printMetricsTable(analysis: AnalysisResult) {
  console.log('\n\x1b[1m📊 VARIANT PERFORMANCE METRICS\x1b[0m');
  console.log('═'.repeat(100));

  analysis.variants.forEach((variant) => {
    const metrics = analysis.metrics[variant.id];
    const isWinner = analysis.winner === variant.id;
    
    console.log();
    if (isWinner) {
      console.log('\x1b[32m%s\x1b[0m', `🏆 ${variant.name.toUpperCase()} (WINNER) 🏆`);
    } else {
      console.log('\x1b[1m%s\x1b[0m', `${variant.name.toUpperCase()}`);
    }
    console.log('─'.repeat(100));
    
    console.log('  \x1b[33m📈 Engagement Metrics:\x1b[0m');
    console.log(`     Impressions:       ${metrics.impressions.toLocaleString()}`);
    console.log(`     Clicks:            ${metrics.clicks.toLocaleString()}`);
    console.log(`     Click-Through:     ${metrics.clickThroughRate.toFixed(2)}%`);
    console.log(`     Avg Time on Page:  ${metrics.avgTimeOnPage.toFixed(1)}s`);
    console.log(`     Bounce Rate:       ${metrics.bounceRate.toFixed(2)}%`);
    
    console.log('  \x1b[33m💰 Conversion Metrics:\x1b[0m');
    console.log(`     Conversions:       ${metrics.conversions.toLocaleString()}`);
    console.log(`     Conversion Rate:   ${metrics.conversionRate.toFixed(2)}%`);
  });
  
  console.log('\n' + '═'.repeat(100));
}

// Print visual comparisons
function printVisualComparisons(analysis: AnalysisResult) {
  console.log('\n\x1b[1m📊 VISUAL COMPARISON\x1b[0m');
  console.log('═'.repeat(100));

  // Find max values for scaling
  const maxCTR = Math.max(...analysis.variants.map(v => analysis.metrics[v.id].clickThroughRate));
  const maxConversion = Math.max(...analysis.variants.map(v => analysis.metrics[v.id].conversionRate));
  const maxTime = Math.max(...analysis.variants.map(v => analysis.metrics[v.id].avgTimeOnPage));
  const maxBounce = Math.max(...analysis.variants.map(v => analysis.metrics[v.id].bounceRate));

  console.log('\n\x1b[36m Click-Through Rate (CTR):\x1b[0m');
  analysis.variants.forEach(v => {
    const metrics = analysis.metrics[v.id];
    console.log(createBarChart(v.name, metrics.clickThroughRate, maxCTR));
  });

  console.log('\n\x1b[36m Conversion Rate:\x1b[0m');
  analysis.variants.forEach(v => {
    const metrics = analysis.metrics[v.id];
    console.log(createBarChart(v.name, metrics.conversionRate, maxConversion));
  });

  console.log('\n\x1b[36m Average Time on Page:\x1b[0m');
  analysis.variants.forEach(v => {
    const metrics = analysis.metrics[v.id];
    console.log(createBarChart(v.name, metrics.avgTimeOnPage, maxTime, 's'));
  });

  console.log('\n\x1b[36m Bounce Rate (lower is better):\x1b[0m');
  analysis.variants.forEach(v => {
    const metrics = analysis.metrics[v.id];
    console.log(createBarChart(v.name, metrics.bounceRate, maxBounce));
  });

  console.log('\n' + '═'.repeat(100));
}

// Print AI analysis
function printAnalysis(analysis: AnalysisResult) {
  console.log('\n\x1b[1m🤖 AI ANALYSIS\x1b[0m');
  console.log('═'.repeat(100));
  
  // Show winner prominently
  if (analysis.winner) {
    const winnerVariant = analysis.variants.find(v => v.id === analysis.winner);
    if (winnerVariant) {
      console.log('\n\x1b[42m\x1b[30m                                                                    \x1b[0m');
      console.log('\x1b[42m\x1b[30m  🏆  RECOMMENDED VARIANT: ' + winnerVariant.name.toUpperCase().padEnd(40) + '\x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                                    \x1b[0m');
    }
  }
  
  console.log('\n\x1b[33m📋 Summary:\x1b[0m');
  console.log(`   ${analysis.summary}`);
  
  console.log('\n\x1b[33m💡 Key Insights:\x1b[0m');
  analysis.insights.forEach((insight, i) => {
    console.log(`   ${i + 1}. ${insight}`);
  });
  
  console.log('\n\x1b[33m🎯 Recommendations:\x1b[0m');
  analysis.recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  
  console.log('\n' + '═'.repeat(100));
}

// Main function
async function main() {
  try {
    printHeader();
    
    console.log('📡 Fetching analysis data...\n');
    
    // Check if config exists
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    if (!fs.existsSync(configPath)) {
      console.error('\x1b[31m❌ Error: No data found. Please run the web application first.\x1b[0m');
      process.exit(1);
    }
    
    // Call the analysis API
    const response = await axios.post(`${API_BASE}/api/analyze`);
    const analysis: AnalysisResult = response.data;
    
    if (!analysis.variants || analysis.variants.length === 0) {
      console.error('\x1b[31m❌ No variants with metrics found. Please run a simulation first.\x1b[0m');
      process.exit(1);
    }
    
    // Check if using fallback data and warn the user
    const isUsingFallbackData = (analysis as any).source === 'simulated_fallback' || 
                                (analysis as any).warning;
    const isUsingLocalEvents = (analysis as any).source === 'local_events_real';
    
    if (isUsingFallbackData) {
      console.log('\n\x1b[43m\x1b[30m                                                                           \x1b[0m');
      console.log('\x1b[43m\x1b[30m  ⚠️  WARNING: USING SIMULATED FALLBACK DATA (NOT REAL USER DATA!)        \x1b[0m');
      console.log('\x1b[43m\x1b[30m                                                                           \x1b[0m');
      console.log('\n\x1b[33m📋 This data is randomly generated for testing purposes.\x1b[0m');
      console.log('\x1b[33m💡 To use REAL data:\x1b[0m');
      console.log('\x1b[33m   1. Restart your dev server (npm run dev)\x1b[0m');
      console.log('\x1b[33m   2. Open http://localhost:3000 and click "Start Capture"\x1b[0m');
      console.log('\x1b[33m   3. Click buttons multiple times\x1b[0m');
      console.log('\x1b[33m   4. Run this analysis again\x1b[0m\n');
    } else if (isUsingLocalEvents) {
      console.log('\n\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\x1b[42m\x1b[30m  ✅  USING REAL DATA FROM YOUR ACTUAL CLICKS!     \x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      const eventCount = (analysis as any).eventCount || 0;
      console.log(`\x1b[32m📊 Total events tracked: ${eventCount}\x1b[0m\n`);
    } else {
      console.log('\n\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\x1b[42m\x1b[30m  ✅  USING REAL STATSIG DATA FROM ACTUAL USERS!   \x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m\n');
    }
    
    // Ask user how they want to view the data
    const { viewMode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'viewMode',
        message: 'How would you like to view the analysis?',
        choices: [
          { name: '📝 Text Summary Only', value: 'text' },
          { name: '📊 Visual Dashboard (ASCII Charts)', value: 'visual' },
          { name: '📋 Both (Detailed View)', value: 'both' },
        ],
      },
    ]);
    
    console.log();
    
    // Display based on choice
    if (viewMode === 'text') {
      printAnalysis(analysis);
    } else if (viewMode === 'visual') {
      printMetricsTable(analysis);
      printVisualComparisons(analysis);
    } else {
      printMetricsTable(analysis);
      printVisualComparisons(analysis);
      printAnalysis(analysis);
    }
    
    // Ask if they want to take action
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '\nWhat would you like to do next?',
        choices: [
          { name: '✅ Apply winning variant', value: 'apply' },
          { name: '🔄 View analysis again', value: 'rerun' },
          { name: '🚪 Exit', value: 'exit' },
        ],
      },
    ]);
    
    if (action === 'apply') {
      if (analysis.winner) {
        await axios.post(`${API_BASE}/api/config`, { currentVariant: analysis.winner });
        console.log('\n\x1b[32m✅ Successfully applied winning variant!\x1b[0m');
        console.log('The website will now use this variant as the default.\n');
      } else {
        console.log('\n\x1b[33m⚠️  No clear winner determined. Review the data and choose manually.\x1b[0m\n');
      }
    } else if (action === 'rerun') {
      await main();
      return;
    }
    
    console.log('\n\x1b[36mThank you for using the AI A/B Testing Platform! 🚀\x1b[0m\n');
    
  } catch (error: any) {
    console.error('\n\x1b[31m❌ Error:\x1b[0m', error.response?.data?.error || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n\x1b[33m💡 Make sure the Next.js server is running:\x1b[0m');
      console.error('   npm run dev\n');
    }
    
    process.exit(1);
  }
}

main();

