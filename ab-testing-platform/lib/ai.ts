import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default genAI;

export async function generateVariants(
  prompt: string,
  currentHtml: string,
  currentCss: string,
  count: number = 2
): Promise<Array<{ name: string; description: string; html: string; css: string }>> {
  const systemPrompt = `You are an expert web designer and UX specialist. You will be given a prompt describing desired changes to a website, along with the current HTML and CSS.

Your task is to generate ${count} distinct variant(s) of the website that implement the requested changes. Each variant should:
1. Make real, tangible changes to the HTML structure, CSS styles, colors, layout, or features
2. Be meaningfully different from the original and from other variants
3. Maintain valid HTML and CSS syntax
4. Focus on UX improvements and conversion optimization

CRITICAL JSON REQUIREMENTS:
- Return ONLY a valid JSON array, no other text
- Keep HTML and CSS concise (max 2000 characters each)
- Escape all quotes and newlines properly in JSON strings
- Use \\n for line breaks in strings
- Use \\" for quotes in strings
- Ensure the JSON is properly terminated

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "Variant Name",
    "description": "Brief description of changes made",
    "html": "complete HTML code (max 2000 chars)",
    "css": "complete CSS code (max 2000 chars)"
  }
]

IMPORTANT: 
- Return ONLY the JSON array, no other text
- Keep content concise to avoid JSON parsing errors
- Make meaningful but focused changes`;

  const userPrompt = `Original HTML:
${currentHtml}

Original CSS:
${currentCss}

Requested changes: ${prompt}

Generate ${count} variant(s) that implement these changes with real, visible differences.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp'
    });
    
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();
    
    // Clean up the response to extract JSON
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```json?\n?/g, '').replace(/```\n?/g, '');
    }
    
    // Try to find and extract JSON array from the response
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    // Additional cleanup for common JSON issues
    cleanedResponse = cleanedResponse
      .replace(/\\n/g, '\\n')  // Preserve newlines in strings
      .replace(/\\"/g, '\\"')  // Preserve escaped quotes
      .replace(/\\\\/g, '\\\\'); // Preserve backslashes
    
    console.log('Cleaned response length:', cleanedResponse.length);
    console.log('First 500 chars:', cleanedResponse.substring(0, 500));
    console.log('Last 500 chars:', cleanedResponse.substring(cleanedResponse.length - 500));
    
    const variants = JSON.parse(cleanedResponse);
    return variants;
  } catch (error: any) {
    console.error('Error generating variants:', error);
    console.error('Error details:', error.message);
    
    // Fallback: Try to generate simple variants if JSON parsing fails
    console.log('Attempting fallback variant generation...');
    try {
      const fallbackVariants = [
        {
          name: "Simplified Variant 1",
          description: "Simplified version with basic changes",
          html: currentHtml.replace(/class="([^"]*)"/g, 'class="$1 variant-1"'),
          css: currentCss + "\n.variant-1 { border: 2px solid #007bff; }"
        },
        {
          name: "Simplified Variant 2", 
          description: "Simplified version with color changes",
          html: currentHtml.replace(/class="([^"]*)"/g, 'class="$1 variant-2"'),
          css: currentCss + "\n.variant-2 { background-color: #f8f9fa; }"
        }
      ];
      return fallbackVariants;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error; // Re-throw original error
    }
  }
}

export async function analyzeVariants(
  variants: Array<{ id: string; name: string; metrics: any }>
): Promise<{
  winner: string | null;
  summary: string;
  insights: string[];
  recommendations: string[];
}> {
  const systemPrompt = `You are a data analyst specializing in A/B testing and conversion rate optimization. 
Analyze the performance metrics of multiple website variants and provide actionable insights.

Return ONLY a valid JSON object with this exact structure:
{
  "winner": "variant_id or null",
  "summary": "2-3 sentence overview of the results",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Do not include any markdown formatting, explanations, or text outside the JSON object.`;

  const metricsText = variants
    .map(
      (v) => `
Variant: ${v.name} (ID: ${v.id})
- Click-through Rate: ${v.metrics.clickThroughRate.toFixed(2)}%
- Conversion Rate: ${v.metrics.conversionRate.toFixed(2)}%
- Avg Time on Page: ${v.metrics.avgTimeOnPage.toFixed(1)}s
- Bounce Rate: ${v.metrics.bounceRate.toFixed(2)}%
- Impressions: ${v.metrics.impressions}
- Clicks: ${v.metrics.clicks}
- Conversions: ${v.metrics.conversions}
`
    )
    .join('\n');

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp'
    });
    
    const fullPrompt = `${systemPrompt}\n\nAnalyze these A/B test results and determine which variant performed best:\n\n${metricsText}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();
    
    // Clean up the response
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```json?\n?/g, '').replace(/```\n?/g, '');
    }
    
    const analysis = JSON.parse(cleanedResponse);
    return analysis;
  } catch (error: any) {
    console.error('Error analyzing variants:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

