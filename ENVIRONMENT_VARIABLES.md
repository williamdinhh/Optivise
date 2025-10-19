# Environment Variables Configuration

## Required Environment Variables

### 1. **STATSIG_SERVER_KEY** (Client-side SDK)
- **Purpose**: Used for client-side Statsig SDK integration
- **Value**: `secret-6D7yVAuLLoCyfAjsiRlnBCUmITcUUQviQTJT7kPPfOE`
- **Used by**: 
  - `components/StatsigProvider.tsx`
  - Client-side event tracking
  - Feature flag evaluation

### 2. **STATSIG_CONSOLE_API_KEY** (Console API)
- **Purpose**: Used for creating experiments via Statsig Console API
- **Value**: `console-4CL2YIipMd5QwR0XWAQq3SJvt8qkOSjpeIJlNKEYrkU`
- **Used by**:
  - `lib/statsig-experiments.ts`
  - `app/api/experiments/create/route.ts`
  - `app/api/variants/generate/route.ts`

### 3. **GEMINI_API_KEY** (AI Features)
- **Purpose**: Used for AI-powered variant generation
- **Value**: Your Google Gemini API key
- **Used by**:
  - `lib/ai.ts`
  - `app/api/variants/generate/route.ts`
  - `app/api/prompts/generate/route.ts`

## Vercel Environment Variables Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
STATSIG_SERVER_KEY=secret-6D7yVAuLLoCyfAjsiRlnBCUmITcUUQviQTJT7kPPfOE
STATSIG_CONSOLE_API_KEY=console-4CL2YIipMd5QwR0XWAQq3SJvt8qkOSjpeIJlNKEYrkU
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Make sure to set them for **Production**, **Preview**, and **Development**
6. **Redeploy** your application after adding the variables

## Key Differences

- **Server Key** (`secret-...`): For client-side SDK operations
- **Console Key** (`console-...`): For administrative API operations (creating experiments)
- **Gemini Key**: For AI-powered features

## Troubleshooting

- **403 Forbidden**: Wrong key type (using server key instead of console key)
- **500 Error**: Missing environment variable
- **AI Features Not Working**: Missing GEMINI_API_KEY
