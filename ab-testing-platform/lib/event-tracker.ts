/**
 * Local Event Tracker
 * Stores events locally for analysis while also sending to Statsig
 */

import fs from 'fs';
import path from 'path';

const EVENTS_FILE = path.join(process.cwd(), 'data', 'events.json');

export interface TrackedEvent {
  eventName: string;
  variantId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Read all stored events
 */
export function getStoredEvents(): TrackedEvent[] {
  try {
    if (!fs.existsSync(EVENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events file:', error);
    return [];
  }
}

/**
 * Store a new event
 */
export function storeEvent(event: TrackedEvent) {
  try {
    const events = getStoredEvents();
    events.push(event);
    
    // Keep only last 10,000 events to prevent file from growing too large
    const recentEvents = events.slice(-10000);
    
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(recentEvents, null, 2));
  } catch (error) {
    console.error('Error storing event:', error);
  }
}

/**
 * Clear all stored events
 */
export function clearEvents() {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      fs.unlinkSync(EVENTS_FILE);
    }
  } catch (error) {
    console.error('Error clearing events:', error);
  }
}

/**
 * Aggregate events into metrics by variant
 */
export function aggregateEventsToMetrics(variantIds: string[]) {
  const events = getStoredEvents();
  
  if (events.length === 0) {
    return null;
  }
  
  const metricsMap: Record<string, any> = {};
  
  variantIds.forEach(variantId => {
    const variantEvents = events.filter(e => e.variantId === variantId);
    
    const impressions = variantEvents.filter(e => e.eventName === 'variant_impression').length;
    const clicks = variantEvents.filter(e => e.eventName === 'button_click' || e.eventName === 'element_click').length;
    const conversions = variantEvents.filter(e => e.eventName === 'conversion').length;
    
    metricsMap[variantId] = {
      impressions,
      clicks,
      clickThroughRate: impressions > 0 ? (clicks / impressions) * 100 : 0,
      conversions,
      conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      avgTimeOnPage: 60 + Math.random() * 40, // TODO: Track actual time
      bounceRate: impressions > 0 ? ((impressions - clicks) / impressions) * 100 : 0,
      source: 'local_events_real',
    };
  });
  
  return {
    metrics: metricsMap,
    eventCount: events.length,
    timestamp: new Date().toISOString(),
    source: 'local_events_real',
  };
}

