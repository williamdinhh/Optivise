import { NextRequest, NextResponse } from 'next/server';
import { generateVariants } from '@/lib/openai';
import { addVariant } from '@/lib/storage';
import { Variant } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentHtml, currentCss, variantCount = 2 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate variants using AI
    const generatedVariants = await generateVariants(
      prompt,
      currentHtml,
      currentCss,
      variantCount
    );

    // Save variants to storage
    const savedVariants: Variant[] = [];
    for (const gv of generatedVariants) {
      const variant: Variant = {
        id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: gv.name,
        description: gv.description,
        html: gv.html,
        css: gv.css,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      addVariant(variant);
      savedVariants.push(variant);
    }

    return NextResponse.json({ variants: savedVariants });
  } catch (error) {
    console.error('Error generating variants:', error);
    return NextResponse.json(
      { error: 'Failed to generate variants', details: (error as Error).message },
      { status: 500 }
    );
  }
}

