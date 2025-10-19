import { NextRequest, NextResponse } from 'next/server';
import { storeEvent } from '@/lib/event-tracker';

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    
    storeEvent({
      eventName: event.eventName,
      variantId: event.variantId,
      timestamp: Date.now(),
      metadata: event.metadata || {},
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging event:', error);
    return NextResponse.json(
      { error: 'Failed to log event' },
      { status: 500 }
    );
  }
}

