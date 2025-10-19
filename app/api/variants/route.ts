import { NextRequest, NextResponse } from 'next/server';
import { getAllVariants, getActiveVariants, removeVariant, updateVariant } from '@/lib/vercel-storage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') === 'true';

    const variants = activeOnly ? getActiveVariants() : getAllVariants();
    return NextResponse.json({ variants });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { variantId } = await request.json();

    if (!variantId) {
      return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
    }

    if (variantId === 'original') {
      return NextResponse.json({ error: 'Cannot delete original variant' }, { status: 400 });
    }

    removeVariant(variantId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { variantId, updates } = await request.json();

    if (!variantId) {
      return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
    }

    updateVariant(variantId, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 });
  }
}

