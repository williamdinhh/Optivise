# 🔍 Verifying Statsig Integration

## Quick Check: Are Events Being Sent?

### Step 1: Open Browser Console

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Open http://localhost:3000**

3. **Open Browser DevTools**:
   - Mac: `Cmd + Option + J`
   - Windows: `Ctrl + Shift + J`
   - Or right-click → "Inspect" → "Console" tab

### Step 2: Look for Statsig Logs

You should see:
```
✅ Statsig Client Initialized: {
  userID: 'anonymous-user',
  sdkKey: 'client-qFzSZVimIzwC...'
}
📡 Test event sent to Statsig
```

### Step 3: Start Capture and Interact

1. Click **"Start Capture"** button
2. Click any button in the Live Preview
3. Check console for:
   ```
   📊 Statsig Event: variant_impression { variant_id: 'original', timestamp: '...' }
   📊 Statsig Event: button_click { variant_id: 'original', button_text: 'Get Started Now', ... }
   ```

## ✅ Seeing Events in Statsig Console

### Step 1: Go to Statsig Dashboard

1. Open https://console.statsig.com
2. Log in to your account
3. Select your project

### Step 2: Navigate to Metrics Explorer

1. Click on **"Metrics"** in the left sidebar
2. Or go to **"Events"** → **"Stream"**
3. Look for your custom events:
   - `statsig_initialized`
   - `variant_impression`
   - `button_click`
   - `element_click`

### Step 3: Verify Event Data

Events should appear with:
- **Event Name**: `button_click`, `variant_impression`, etc.
- **User ID**: `anonymous-user`
- **Metadata**: `variant_id`, `button_text`, `timestamp`, etc.

## 🔧 Troubleshooting

### ❌ No Logs in Browser Console?

**Check:**
1. Is the dev server running?
2. Did you refresh the page?
3. Is the Console tab selected in DevTools?

**Fix:**
```bash
# Restart dev server
cd /Users/sidiq/Documents/Optivise/ab-testing-platform
npm run dev
```

### ❌ No Events in Statsig Console?

**Possible Issues:**

#### 1. Wrong API Key
Check your `.env.local`:
```bash
cat .env.local
```

Should show:
```
NEXT_PUBLIC_STATSIG_CLIENT_KEY=client-qFzSZVimIzwC9zb8mM91G0qkiAL4lEOCoj6vTHsq2Sa
```

#### 2. Wrong Statsig Project
Make sure you're viewing the correct project in Statsig Console:
- Top-left dropdown → Select correct project
- The project should match your API key

#### 3. Events Take Time to Appear
- **Wait 30-60 seconds** for events to process
- Refresh the Statsig Console page
- Check the time range filter (set to "Last Hour")

#### 4. Check Network Tab
1. Open DevTools → Network tab
2. Filter by "statsig"
3. Look for requests to `api.statsig.com`
4. Click on a request to see if it was successful (200 status)

### 🔍 Debug Mode

Add this to your browser console to see more details:
```javascript
// Check if Statsig client is available
console.log('Statsig client:', window.statsigClient);

// Manually log a test event
if (window.statsigClient) {
  window.statsigClient.logEvent('debug_test', 'manual_test', {
    timestamp: Date.now()
  });
  console.log('Manual test event sent!');
}
```

## 📊 Expected Statsig Console View

Once events are flowing, you should see in Statsig:

### Metrics Dashboard
```
📊 Custom Events (Last Hour)
─────────────────────────────
variant_impression     ●●●●●●●●● 25 events
button_click          ●●●●●● 15 events
element_click         ●●●● 10 events
statsig_initialized   ●● 5 events
```

### Event Details
Click on any event to see:
```json
{
  "event": "button_click",
  "user": {
    "userID": "anonymous-user"
  },
  "value": "Get Started Now",
  "metadata": {
    "variant_id": "original",
    "button_text": "Get Started Now",
    "button_index": 0,
    "timestamp": 1234567890
  }
}
```

## 🎯 Next Steps Once Verified

Once you see events in Statsig Console:

### 1. Set Up Metrics
1. Go to Statsig Console → **Metrics** → **Create Metric**
2. Create metrics for:
   - Click-through Rate (CTR)
   - Conversion Rate
   - Engagement Rate

### 2. Create an Experiment (Optional)
1. Go to **Experiments** → **Create Experiment**
2. Name it: "Website Variant Test"
3. Add your variant IDs as groups
4. Set metrics to track

### 3. View Real-Time Data
- **Pulse**: See live event stream
- **Metrics**: View aggregated data
- **Experiments**: Compare variant performance

## 🔄 Quick Test Script

Want to quickly test if Statsig is working? Run this:

1. Open http://localhost:3000
2. Open Browser Console (F12)
3. Paste this code:
```javascript
// Test if Statsig is initialized
if (typeof StatsigClient !== 'undefined') {
  console.log('✅ Statsig is loaded');
} else {
  console.log('❌ Statsig not found');
}

// Test event logging
setTimeout(() => {
  console.log('🧪 Testing event logging...');
  document.querySelector('[data-capture-btn]')?.click();
}, 2000);
```

## 📞 Still Having Issues?

### Check These Files:
1. **`.env.local`** - API key correct?
2. **`components/StatsigProvider.tsx`** - Check initialization
3. **Browser Network Tab** - Are requests being made?
4. **Statsig Status** - Check https://status.statsig.com

### Get Help:
- Statsig Docs: https://docs.statsig.com/client/javascript-sdk
- Statsig Support: support@statsig.com
- Check browser console for errors

## ✅ Success Checklist

- [ ] Browser console shows Statsig initialized
- [ ] Browser console shows events being logged (📊)
- [ ] Network tab shows requests to api.statsig.com
- [ ] Statsig Console shows events (may take 30-60 seconds)
- [ ] Event metadata is correct (variant_id, etc.)

Once all checked ✅, your integration is working perfectly!

---

**💡 Pro Tip**: Keep the browser console open while testing to see events in real-time!

