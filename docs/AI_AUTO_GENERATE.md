# 🤖 AI Auto-Generate Feature

## Overview

The **AI Auto-Generate** feature uses Google's Gemini AI to analyze your current website variant and automatically generate intelligent, context-aware optimization suggestions. This eliminates the need to think of prompts yourself - the AI does all the creative work!

## How It Works

### 1. Analysis Phase

When you click **"🤖 Auto-Generate with AI"**:

- Your current variant's HTML and CSS are sent to Gemini
- AI analyzes the structure, design, and UX patterns
- Considers modern best practices and conversion optimization principles

### 2. Prompt Generation

Gemini generates a specific, actionable optimization suggestion:

- ✅ "Make the CTA button 30% larger with a pulsing animation to draw attention"
- ✅ "Add social proof badges below the hero section with customer testimonials"
- ✅ "Transform the pricing section into a comparison table with highlighted features"
- ❌ NOT generic advice like "improve the design" or "make it better"

### 3. Automatic Variant Creation

- The AI-generated prompt is automatically filled into the prompt field
- After 1.5 seconds, variant generation begins automatically
- New variants are created based on the AI's optimization suggestion

## Usage

### From the Dashboard

1. Navigate to **Dashboard → Variant Generator**
2. Click **"🤖 Auto-Generate with AI"** button
3. Watch the AI think (shows "🤖 AI Thinking..." while processing)
4. See the generated prompt appear in the text area
5. Variants are automatically created and added to your list

### What Happens Behind the Scenes

```
User clicks "Auto-Generate"
    ↓
Frontend calls /api/prompts/generate
    ↓
Backend sends HTML/CSS to Gemini
    ↓
Gemini analyzes and generates prompt
    ↓
Prompt returned to frontend
    ↓
Prompt auto-fills in text area
    ↓
Variants generated automatically
    ↓
Success! New variants ready to test
```

## Technical Details

### API Endpoint

**POST** `/api/prompts/generate`

**Request Body:**

```json
{
  "currentHtml": "string",
  "currentCss": "string"
}
```

**Response:**

```json
{
  "prompt": "Make the CTA button 30% larger with pulsing animation"
}
```

### AI Function

Located in `lib/ai.ts`:

```typescript
export async function generateOptimizationPrompt(
  currentHtml: string,
  currentCss: string
): Promise<string>;
```

**Features:**

- Uses Gemini 2.0 Flash Exp model
- Analyzes up to 1500 chars of HTML and 1000 chars of CSS
- Returns prompts under 150 characters
- Has fallback prompts if API fails

### Fallback Behavior

If Gemini API is unavailable or fails:

1. Uses intelligent fallback prompts
2. Shows message: "Using fallback prompt (AI unavailable)"
3. Still generates variants successfully
4. User experience is minimally impacted

**Fallback Prompts:**

- "Make the call-to-action button more prominent with a contrasting color and larger size"
- "Improve the hero section with better visual hierarchy and clear value proposition"
- "Add visual elements like icons or illustrations to break up text-heavy sections"
- "Optimize the layout for mobile devices with better spacing and touch targets"

## Benefits

### For Users

- 🎯 **No Creative Block**: AI suggests optimizations when you're out of ideas
- ⚡ **Faster Workflow**: One click instead of typing prompts
- 🧠 **Learn Best Practices**: See what experts would optimize
- 🎨 **Creative Variety**: Get suggestions you might not have thought of

### For Developers

- 🔧 **Easy Integration**: Simple API endpoint
- 📦 **Modular Design**: Separate from variant generation
- 🛡️ **Error Handling**: Graceful fallbacks if AI unavailable
- 📊 **Observable**: Logged prompts for analysis

## Configuration

### Required Environment Variable

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your key from: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

### No Additional Setup Required

The feature works automatically once the Gemini API key is configured. No database changes, no additional dependencies.

## UI/UX Details

### Button States

**Normal State:**

```
🤖 Auto-Generate with AI
```

**Loading State:**

```
🤖 AI Thinking...
```

- Button is disabled
- Gray background
- Cursor shows "not-allowed"

### User Feedback

**Success:**

- Message displays: "🤖 AI generated prompt: [prompt text]"
- Prompt fills the text area
- After 1.5 seconds, variants begin generating

**Fallback:**

- Message displays: "Using fallback prompt (AI unavailable): [prompt text]"
- Still generates variants successfully
- User can continue normally

## Examples

### Example 1: E-commerce Site

**Input:** Product listing page HTML/CSS
**AI Output:** "Add urgency indicators with stock levels and countdown timers for flash sales"

### Example 2: SaaS Landing Page

**Input:** Hero section with signup form
**AI Output:** "Transform signup CTA into two-step process with benefit-focused micro-copy"

### Example 3: Blog Homepage

**Input:** Article grid layout
**AI Output:** "Implement card-based design with thumbnail images and reading time estimates"

### Example 4: Contact Form

**Input:** Basic contact form
**AI Output:** "Add inline validation with green checkmarks and helpful error messages"

## Best Practices

### When to Use AI Auto-Generate

✅ **Good Use Cases:**

- You're not sure what to optimize next
- You want fresh ideas and perspectives
- You're learning about UX best practices
- You want to quickly test different approaches
- You're exploring creative variations

❌ **When to Use Custom Prompts Instead:**

- You have a specific change in mind
- You're implementing brand guidelines
- You need precise control over changes
- You're testing a hypothesis

### Tips for Best Results

1. **Start with a good base variant** - Better input = better suggestions
2. **Try multiple times** - Each generation is unique
3. **Review the prompt** - Edit it before generating if needed
4. **Test the results** - Not all AI suggestions will work perfectly
5. **Learn from patterns** - Notice what the AI prioritizes

## Troubleshooting

### "AI unavailable" Message

**Causes:**

- Gemini API key not configured
- API rate limit reached
- Network connectivity issues
- Gemini service temporarily down

**Solution:**

- Verify `GEMINI_API_KEY` in `.env.local`
- Check API quota in Google Cloud Console
- Use fallback prompts (automatic)
- Try again in a few minutes

### Prompt Doesn't Make Sense

**Causes:**

- HTML/CSS structure is unusual
- Not enough context for AI to analyze
- Random variation in AI output

**Solution:**

- Click Auto-Generate again for a different suggestion
- Edit the prompt manually before generating
- Use custom prompt instead

### Variants Not Generated

**Causes:**

- This is a different issue from prompt generation
- Check variant generation logs
- Verify Gemini API key

**Solution:**

- See variant generation documentation
- Check browser console for errors
- Review API logs

## Future Enhancements

Potential improvements for this feature:

1. **Multi-prompt Generation** - Generate 3-5 prompts, let user choose
2. **Context-aware Suggestions** - Based on industry or page type
3. **Historical Learning** - Remember what worked well before
4. **A/B Test History Analysis** - Suggest based on past winners
5. **Competitive Analysis** - Compare with similar sites
6. **User Persona Targeting** - Generate prompts for specific audiences

## Code References

- **API Route**: `app/api/prompts/generate/route.ts`
- **AI Function**: `lib/ai.ts` → `generateOptimizationPrompt()`
- **Component**: `components/ModeratorDashboard.tsx` → `handleAutoGenerate()`
- **Button**: Line ~220 in ModeratorDashboard.tsx

## Related Documentation

- [Main README](../README.md)
- [Project Summary](./PROJECT_SUMMARY.md)
- [Features Documentation](./FEATURES.md)
- [AI Integration Guide](../lib/ai.ts) (source code)

---

**Note**: This feature requires an active Gemini API key and internet connectivity. Fallback prompts are available if the AI service is unavailable.
