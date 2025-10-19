import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Log API key status (without exposing the key)
if (process.env.GEMINI_API_KEY) {
  console.log('✅ Gemini API key is configured');
  console.log('🔑 API Key starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
} else {
  console.warn('⚠️  GEMINI_API_KEY not set - AI features will not work');
}

export default genAI;

export async function generateVariants(
  prompt: string,
  currentHtml: string,
  currentCss: string,
  count: number = 2
): Promise<
  Array<{ name: string; description: string; html: string; css: string }>
> {
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
      model: "gemini-2.0-flash-exp",
    });

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();

    // Clean up the response to extract JSON
    let cleanedResponse = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/```json?\n?/g, "")
        .replace(/```\n?/g, "");
    }

    // Try to find and extract JSON array from the response
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    // Additional cleanup for common JSON issues
    cleanedResponse = cleanedResponse
      .replace(/\\n/g, "\\n") // Preserve newlines in strings
      .replace(/\\"/g, '\\"') // Preserve escaped quotes
      .replace(/\\\\/g, "\\\\"); // Preserve backslashes

    console.log("Cleaned response length:", cleanedResponse.length);
    console.log("First 500 chars:", cleanedResponse.substring(0, 500));
    console.log(
      "Last 500 chars:",
      cleanedResponse.substring(cleanedResponse.length - 500)
    );

    const variants = JSON.parse(cleanedResponse);
    return variants;
  } catch (error: any) {
    console.error("Error generating variants:", error);
    console.error("Error details:", error.message);

    // Fallback: Try to generate simple variants if JSON parsing fails
    console.log("Attempting fallback variant generation...");
    try {
      const fallbackVariants = [
        {
          name: "Simplified Variant 1",
          description: "Simplified version with basic changes",
          html: currentHtml.replace(/class="([^"]*)"/g, 'class="$1 variant-1"'),
          css: currentCss + "\n.variant-1 { border: 2px solid #007bff; }",
        },
        {
          name: "Simplified Variant 2",
          description: "Simplified version with color changes",
          html: currentHtml.replace(/class="([^"]*)"/g, 'class="$1 variant-2"'),
          css: currentCss + "\n.variant-2 { background-color: #f8f9fa; }",
        },
      ];
      return fallbackVariants;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw error; // Re-throw original error
    }
  }
}

export async function generateOptimizationPrompt(
  currentHtml: string,
  currentCss: string
): Promise<string> {
  const systemPrompt = `You are an expert UX designer and conversion rate optimization specialist. 
Analyze the provided website HTML and CSS, and generate a single, creative, specific optimization suggestion that would improve user engagement, conversion rates, or user experience.

Your suggestion should:
1. Be specific and actionable (not generic advice)
2. Focus on one concrete improvement
3. Consider modern UX best practices
4. Be creative and interesting (avoid obvious suggestions)
5. Be suitable as a prompt for AI to implement

Return ONLY the optimization suggestion as a single sentence or short paragraph (max 150 characters), no JSON, no formatting, just the raw prompt text.

Examples of good suggestions:
- "Make the CTA button 30% larger with a pulsing animation to draw attention"
- "Add social proof badges below the hero section with customer testimonials"
- "Transform the pricing section into a comparison table with highlighted features"
- "Add a countdown timer to create urgency for limited-time offers"
- "Implement a sticky navigation bar with smooth scroll-to-section functionality"`;

  const userPrompt = `Current HTML:
${currentHtml.substring(0, 1500)}

Current CSS:
${currentCss.substring(0, 1000)}

Generate ONE creative, specific optimization suggestion for this website:`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text().trim();

    // Remove any quotes or formatting
    let cleanedPrompt = responseText
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/^\*\*|\*\*$/g, "") // Remove bold markdown
      .trim();

    // Limit to 150 characters if needed
    if (cleanedPrompt.length > 150) {
      cleanedPrompt = cleanedPrompt.substring(0, 147) + "...";
    }

    return cleanedPrompt;
  } catch (error: any) {
    console.error("Error generating optimization prompt:", error);

    // Fallback prompts if API fails
    const fallbackPrompts = [
      "Make the call-to-action button more prominent with a contrasting color and larger size",
      "Improve the hero section with better visual hierarchy and clear value proposition",
      "Add visual elements like icons or illustrations to break up text-heavy sections",
      "Optimize the layout for mobile devices with better spacing and touch targets",
      "Enhance the color scheme to create better contrast and visual appeal",
    ];

    return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
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
  const systemPrompt = `You are an expert data analyst specializing in A/B testing and conversion rate optimization. 
Your task is to CAREFULLY analyze the performance metrics of multiple website variants and determine the TRUE winner based on data.

CRITICAL ANALYSIS REQUIREMENTS:
1. Examine ALL metrics for each variant thoroughly
2. Compare performance across all variants systematically
3. Calculate which variant has the BEST overall performance
4. Base your decision on ACTUAL DATA, not assumptions or order
5. Consider these factors in order of importance:
   - Conversion Rate (most critical for business impact)
   - Click-through Rate (user engagement)
   - Time on Page (content engagement)
   - Bounce Rate (content quality)
   - Total conversions (absolute business impact)

ANALYSIS PROCESS:
- Compare each metric across all variants
- Identify which variant leads in the most important metrics
- If metrics are close, prioritize conversion rate and total conversions
- Provide specific data points in your reasoning

IMPORTANT: Do NOT default to the first variant. Analyze the actual data and choose the variant that truly performed best.

Return ONLY a valid JSON object with this exact structure:
{
  "winner": "variant_id (MUST be the actual best performing variant based on thorough data analysis)",
  "summary": "Detailed explanation of why this variant won, including specific metrics and comparisons with other variants",
  "insights": ["data-driven insight 1", "data-driven insight 2", "data-driven insight 3"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"]
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
    .join("\n");

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const fullPrompt = `${systemPrompt}\n\nAnalyze these A/B test results and determine which variant performed best. You MUST choose a winner based on the available data, even if the differences are small or the data is limited:\n\n${metricsText}\n\nRemember: Always provide a winner. Consider the overall performance trends and pick the variant that shows the most promise.`;

    console.log('🤖 Sending analysis prompt to AI with data:');
    console.log('📊 Variants count:', variants.length);
    console.log('📊 Metrics data:', metricsText);

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();

    // Clean up the response
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/```json?\n?/g, "")
        .replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(cleanedResponse);

    // Ensure we always have a winner - if AI returns null, pick the best performing variant as fallback
    if (!analysis.winner && variants.length > 0) {
      console.warn("⚠️  AI did not return a winner, calculating fallback based on metrics");
      
      // Find the variant with the highest conversion rate
      const bestVariant = variants.reduce((best, current) => {
        const bestConversionRate = best.metrics?.conversionRate || 0;
        const currentConversionRate = current.metrics?.conversionRate || 0;
        return currentConversionRate > bestConversionRate ? current : best;
      });
      
      analysis.winner = bestVariant.id;
      analysis.summary = `Fallback analysis: ${bestVariant.name} selected based on highest conversion rate (${bestVariant.metrics?.conversionRate?.toFixed(2)}%). AI analysis was incomplete.`;
      analysis.insights = [
        "AI analysis failed - using fallback calculation",
        `Best conversion rate: ${bestVariant.metrics?.conversionRate?.toFixed(2)}%`,
        "Consider reviewing the data quality"
      ];
      analysis.recommendations = [
        "Verify the data quality and metrics",
        "Try running the analysis again",
        "Check if all variants have sufficient data"
      ];
    }

    return analysis;
  } catch (error: any) {
    console.error("Error analyzing variants:", error);
    console.error("Error details:", error.message);
    
    // Handle quota exceeded error
    if (error.message && error.message.includes("quota")) {
      console.warn("⚠️  Gemini API quota exceeded - providing intelligent fallback analysis");
      
      // Find the variant with the highest conversion rate (same logic as main fallback)
      const bestVariant = variants.reduce((best, current) => {
        const bestConversionRate = best.metrics?.conversionRate || 0;
        const currentConversionRate = current.metrics?.conversionRate || 0;
        return currentConversionRate > bestConversionRate ? current : best;
      });
      
      const fallbackAnalysis = {
        winner: bestVariant.id,
        summary: `Analysis completed using fallback calculation: ${bestVariant.name} performed best with ${bestVariant.metrics?.conversionRate?.toFixed(2)}% conversion rate. AI analysis was unavailable due to quota limits.`,
        insights: [
          `Best performing variant: ${bestVariant.name}`,
          `Highest conversion rate: ${bestVariant.metrics?.conversionRate?.toFixed(2)}%`,
          "Analysis based on conversion rate comparison"
        ],
        recommendations: [
          "Consider upgrading your Gemini API plan for AI-powered insights",
          "Monitor conversion rates to validate this analysis",
          "Try running analysis again when quota resets"
        ]
      };
      
      return fallbackAnalysis;
    }
    
    throw error;
  }
}
