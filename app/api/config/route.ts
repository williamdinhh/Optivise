import { NextRequest, NextResponse } from 'next/server';
import { getConfig, setCurrentVariant } from '@/lib/vercel-storage';

export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { currentVariant } = await request.json();

    if (!currentVariant) {
      return NextResponse.json({ error: 'Current variant is required' }, { status: 400 });
    }

    setCurrentVariant(currentVariant);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}

