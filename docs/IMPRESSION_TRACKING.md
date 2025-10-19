# Impression Tracking & Standalone Website

## Overview

The platform now supports automatic impression tracking and includes a standalone website view that can be opened in a separate browser tab, simulating how a real website would track user interactions.

## Features

### 1. Standalone Website (`/site`)

A clean, production-like view of your website that:

- **Loads in a separate tab** - Can be opened independently from the dashboard
- **Automatic impression tracking** - Every page load is tracked as an impression
- **Real-time interaction tracking** - All clicks and user interactions are captured
- **A/B test distribution** - Randomly selects from active variants (simulating real A/B testing)
- **No dashboard UI** - Clean, distraction-free website view

**Access URL**: `http://localhost:3000/site` (or your deployed URL + `/site`)

### 2. Impression Tracking

Impressions are automatically tracked when:

- A user visits the standalone website (`/site`)
- The website preview loads with capture enabled
- Any variant is displayed to a user

**Event Details**:

- **Event Name**: `variant_impression`
- **Metadata**:
  - `variant_id`: The ID of the displayed variant
  - `timestamp`: When the impression occurred

### 3. Integration with Statsig

All impressions are logged to both:

1. **Statsig** - For production analytics and A/B testing
2. **Local Event Tracker** - For immediate local analysis

## How to Use

### Opening the Standalone Website

**From Dashboard:**

1. Go to `/dashboard`
2. Click "🌐 Open Website in New Tab" button in the sidebar or quick actions
3. The website opens in a new tab at `/site`

**From Main Page:**

1. Go to the home page (`/`)
2. Click "🌐 Open Website in New Tab" in Quick Actions
3. The website opens in a new tab

**Direct Access:**

- Navigate directly to `/site` in your browser
- Share this URL with testers or users

### Tracking Impressions

Impressions are tracked automatically. No additional setup required!

**What Gets Tracked:**

1. **Impressions** - Every time someone views the page
2. **Clicks** - Button and element clicks
3. **Interactions** - All clickable element interactions

### Viewing Analytics

**Local Analytics:**

1. Go to Dashboard → Testing & Analytics
2. View real-time metrics including:
   - Total impressions
   - Click-through rate (CTR)
   - Conversion rate
   - Bounce rate

**Statsig Console:**

1. Click "Open Statsig Console →" from the dashboard
2. View comprehensive analytics including:
   - User segments
   - Event funnels
   - Session replays
   - A/B test results

## Technical Details

### Event Flow

```
User visits /site
    ↓
Random variant selected from active variants
    ↓
Page renders with DemoWebsite component
    ↓
Impression event logged (variant_impression)
    ↓
Events sent to:
    - Statsig API (for production analytics)
    - Local Event Tracker (for immediate analysis)
    ↓
User interacts with page
    ↓
Click events logged (button_click, element_click)
```

### Configuration

**Enable/Disable Tracking:**

- Tracking is always enabled on `/site` for authentic behavior
- Can be toggled on/off in dashboard previews via the Capture Panel

**A/B Test Distribution:**

- The standalone site randomly selects from all **active** variants
- This simulates real A/B testing where users see different versions
- Distribution is uniform (equal probability for each active variant)

## Best Practices

### For Testing

1. **Use Multiple Tabs/Windows** - Open multiple instances of `/site` to see different variants
2. **Share the Link** - Send `/site` URL to testers or stakeholders
3. **Monitor in Real-Time** - Watch events appear in the Testing & Analytics panel

### For Production

1. **Keep variants active** - Only active variants are shown to users
2. **Monitor Statsig** - Check Statsig console for detailed analytics
3. **Export data regularly** - Use the export feature in Testing & Analytics

### For Development

1. **Test locally first** - Verify tracking works on localhost
2. **Check console logs** - Events are logged with 📊 prefix
3. **Clear test data** - Use "Clear Events" in Testing & Analytics when needed

## Troubleshooting

### Impressions Not Tracking

- Ensure Statsig client is initialized (check browser console)
- Verify `NEXT_PUBLIC_STATSIG_CLIENT_KEY` is set in `.env`
- Check network tab for API calls to `/api/events/log`

### Variant Not Displaying

- Ensure at least one variant is marked as "Active"
- Check that variants exist in the config
- Verify `/api/config` returns valid data

### Analytics Not Updating

- Wait a few seconds for events to process
- Refresh the analytics panel
- Check Statsig console for near real-time data

## API Endpoints

- `GET /site` - Standalone website page
- `POST /api/events/log` - Log tracking events
- `GET /api/events/export` - Export event data
- `GET /api/config` - Get current variant configuration

## Next Steps

- **Share `/site` with team members** to gather real impressions
- **Monitor CTR and conversion rates** in analytics
- **Generate new variants** and compare performance
- **Export data** for deeper analysis

---

For more information, see:

- [Project Summary](./PROJECT_SUMMARY.md)
- [Features](./FEATURES.md)
- [Deployment Guide](../DEPLOYMENT.md)
