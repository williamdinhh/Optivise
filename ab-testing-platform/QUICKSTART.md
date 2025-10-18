# Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up your OpenAI API key
echo "OPENAI_API_KEY=your-key-here" > .env.local

# 3. Start the dev server
npm run dev
```

## Step 2: Generate Variants (1 minute)

1. Open http://localhost:3000
2. Click **"Auto-Generate Optimal Variants"** button
3. Wait for AI to create variants (15-30 seconds)

## Step 3: Simulate Users (30 seconds)

1. Scroll down to "User Data Simulation"
2. Click **"Run Simulation"**
3. Data is now generated!

## Step 4: View Analysis (1 minute)

```bash
# In a new terminal
npm run analyze
```

Select your preferred view:
- 📝 Text Summary - AI insights only
- 📊 Visual Dashboard - Charts and graphs
- 📋 Both - Everything!

## Step 5: Apply Winner (30 seconds)

When prompted, choose:
- ✅ **Apply winning variant** to use the best version
- 🔄 Iterate with more variants

## That's it! 🎉

You now have an AI-powered A/B testing platform running.

## Next Steps

- Try custom prompts: "Make the button green and 20% larger"
- Generate multiple variants and compare them
- Review the full README.md for advanced features

## Troubleshooting

**"OpenAI API key not configured"**
→ Make sure you created `.env.local` with your API key

**Terminal analysis fails**
→ Ensure the dev server is running in another terminal

**No real changes in variants**
→ Try the auto-generate feature or be more specific in prompts

