# 🚀 Statsig Integration Guide

## Overview

Your A/B testing platform now uses **Statsig** for real-time event tracking and analytics! No more synthetic data - all interactions are tracked live.

## 🎯 What Changed

### Before (Synthetic Simulation)
- ❌ Fake user data generated randomly
- ❌ No real user interactions tracked
- ❌ Simulated metrics for testing

### After (Real Statsig Tracking)
- ✅ Real user interactions tracked in real-time
- ✅ Live event capture with Statsig SDK
- ✅ Actual metrics from real user behavior
- ✅ AI analyzes real data for recommendations

## 📊 New Workflow

### 1. Generate Variants
```
Click "Auto-Generate Optimal Variants" or enter custom prompts
```

### 2. Start Event Capture
```
Click "Start Capture" button to begin tracking
```

### 3. Interact with Variants
```
Click buttons, elements - all tracked automatically
```

### 4. Analyze Real Data
```bash
npm run analyze
```

### 5. Deploy Winner
```
AI recommends best variant based on real user behavior
```

## 🔑 Environment Variables

Required in `.env.local`:

```bash
# Gemini AI (for variant generation and analysis)
GEMINI_API_KEY=your_gemini_key

# Statsig Client Key (for frontend event tracking)
NEXT_PUBLIC_STATSIG_CLIENT_KEY=client-qFzSZVimIzwC9zb8mM91G0qkiAL4lEOCoj6vTHsq2Sa

# Statsig Server Key (optional - for server-side operations)
STATSIG_SERVER_KEY=secret-your-server-key
```

## 📡 Tracked Events

When capture is enabled, Statsig automatically tracks:

### Impressions
- **Event**: `variant_impression`
- **When**: Variant is displayed to user
- **Data**: variant_id, timestamp

### Clicks
- **Event**: `button_click`
- **When**: User clicks any button
- **Data**: variant_id, button_text, button_index, timestamp

### Element Interactions
- **Event**: `element_click`
- **When**: User clicks links, buttons, or clickable elements
- **Data**: variant_id, element_type, element_text, element_index, timestamp

## 🎨 UI Indicators

### Recording Badge
When capture is active, you'll see:
```
🔴 Recording
```

### Capture Panel States
- **⚫ Paused**: Event capture is off
- **🔴 Recording**: Events being tracked in real-time

## 📈 How Metrics Work

1. **Events Flow to Statsig**: All tracked events are sent to Statsig's servers
2. **Metrics Aggregation**: Statsig aggregates events into metrics
3. **AI Analysis**: Our AI fetches metrics and provides recommendations
4. **Terminal Display**: View results in beautiful ASCII charts

## 🔧 Technical Implementation

### Frontend (Client-Side)
```typescript
// StatsigProvider wraps the entire app
<StatsigProvider>
  <YourApp />
</StatsigProvider>

// Events logged when capture is enabled
client.logEvent('button_click', buttonText, {
  variant_id: variantId,
  timestamp: Date.now()
});
```

### Backend (Server-Side)
```typescript
// Fetch real metrics from Statsig
const metricsResponse = await axios.get('/api/statsig/metrics');

// AI analyzes real data
const analysis = await analyzeVariants(realMetrics);
```

## 🎯 Best Practices

### 1. Test with Real Interactions
- Don't just click once - simulate real user behavior
- Try different interaction patterns
- Test on multiple devices/browsers

### 2. Give It Time
- Let data accumulate (at least 10-20 interactions per variant)
- More data = better AI recommendations
- Statistical significance matters

### 3. Monitor Recording State
- Always check if capture is active (recording badge)
- Stop capture when not needed to save quota
- Start fresh capture for each test run

### 4. Trust the AI
- AI recommendations are based on real data
- Look at the confidence indicators
- Consider sample size in decision-making

## 🚀 Quick Start

```bash
# 1. Start the dev server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Generate variants
Click "Auto-Generate Optimal Variants"

# 4. Start tracking
Click "▶️ Start Capture"

# 5. Interact with the site
Click buttons, navigate, etc.

# 6. Analyze results
npm run analyze

# 7. Apply winner
Follow AI recommendations
```

## 📊 Understanding the Analysis

The terminal analysis will show:

```
📊 VARIANT PERFORMANCE METRICS
═══════════════════════════════════════════════════════

🏆 Variant B - Enhanced CTA (WINNER) 🏆
─────────────────────────────────────────────────────────
  📈 Engagement Metrics:
     Impressions:       124
     Clicks:            18
     Click-Through:     14.52%
     Source:            statsig_events ← Real data!
     
🤖 AI ANALYSIS
═══════════════════════════════════════════════════════
💡 Key Insights:
   1. Variant B shows 23% higher engagement
   2. Real user behavior confirms AI predictions
   3. Statistical significance achieved
```

## 🔐 Security Notes

- ✅ `.env.local` is gitignored (API keys safe)
- ✅ Client key is public (safe to expose)
- ⚠️ Server key must stay secret (never commit)
- ✅ Statsig SDK handles security automatically

## 🎓 Learning More

- **Statsig Docs**: https://docs.statsig.com
- **Event Logging**: https://docs.statsig.com/client/jsClient#logging-custom-events
- **Console API**: https://docs.statsig.com/console-api/introduction

## 💡 Tips & Tricks

### Viewing Statsig Console
1. Go to https://console.statsig.com
2. Log in with your account
3. View all events in real-time
4. See detailed analytics and charts

### Custom Events
Add your own events in the code:
```typescript
client.logEvent('custom_event', 'event_value', {
  custom_property: 'value',
  timestamp: Date.now()
});
```

### Debugging
Check browser console for Statsig logs:
```javascript
// Statsig automatically logs events in dev mode
console.log('Event tracked:', eventName);
```

## 🎉 What's Next?

Now that you have real event tracking:

1. **Deploy to Production**: Use Vercel/Netlify
2. **A/B Test Real Users**: Share the link
3. **Iterate Based on Data**: Use AI recommendations
4. **Scale Up**: Add more variants and experiments

## ❓ Troubleshooting

### Events Not Tracking?
- ✅ Check if "Start Capture" is active
- ✅ Look for "Recording" badge
- ✅ Check browser console for errors
- ✅ Verify NEXT_PUBLIC_STATSIG_CLIENT_KEY is set

### No Metrics in Analysis?
- ✅ Generate some interactions first
- ✅ Wait a few seconds for Statsig to process
- ✅ Check that variants are active
- ✅ Verify API keys are correct

### AI Analysis Failing?
- ✅ Check GEMINI_API_KEY is set
- ✅ Ensure you have credits
- ✅ Restart dev server after changing .env.local
- ✅ Check terminal for detailed error messages

---

**🎊 Congratulations!** You're now using real A/B testing with Statsig! 🚀

Your platform is production-ready for tracking real user behavior and making data-driven decisions.

