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

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "Variant Name",
    "description": "Brief description of changes made",
    "html": "complete HTML code",
    "css": "complete CSS code"
  }
]

Do not include any markdown formatting, explanations, or text outside the JSON array.`;

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
    
    const variants = JSON.parse(cleanedResponse);
    return variants;
  } catch (error: any) {
    console.error('Error generating variants:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Gemini API error:', error.response.data);
    }
    throw error;
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

