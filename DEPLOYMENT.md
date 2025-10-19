# 🚀 Deployment Guide - Optivise to Vercel

## Quick Start

### 1. Get Your API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key (starts with `AIza...`)

#### Statsig Keys
1. Go to [Statsig Console](https://console.statsig.com)
2. Create a new project or use existing
3. Get your **Client Key** (for frontend)
4. Get your **Console Key** (for backend)

### 2. Prepare Your Code

```bash
# Test your build locally first
npm run build

# If build succeeds, you're ready to deploy!
```

### 3. Deploy to Vercel

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/optivise)

#### Option B: Manual Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   
   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `GEMINI_API_KEY` | `AIza...` | Production, Preview, Development |
   | `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | `client-...` | Production, Preview, Development |
   | `STATSIG_CONSOLE_KEY` | `secret-...` | Production, Preview, Development |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

## Environment Variables Template

Create a `.env.local` file in your project root:

```bash
# AI Configuration
GEMINI_API_KEY=AIza_your_actual_key_here

# Statsig Configuration  
NEXT_PUBLIC_STATSIG_CLIENT_KEY=client_your_actual_key_here
STATSIG_CONSOLE_KEY=secret_your_actual_key_here
```

## Troubleshooting

### Build Fails
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint

# Test build locally
npm run build
```

### Environment Variables Issues
- ✅ Variables must be set in Vercel dashboard
- ✅ Redeploy after adding variables
- ✅ Check exact variable names (case-sensitive)
- ✅ No spaces around the `=` sign

### API Routes Not Working
- Check Vercel function logs in dashboard
- Verify API keys are correct
- Test endpoints locally first

## Post-Deployment

### 1. Test Your Live App
- Visit your Vercel URL
- Test variant generation
- Check analytics tracking
- Verify all features work

### 2. Set Up Custom Domain (Optional)
- Go to Vercel dashboard → Settings → Domains
- Add your custom domain
- Configure DNS records

### 3. Monitor Performance
- Use Vercel Analytics
- Check function logs
- Monitor API usage

## Continuous Deployment

Once connected to GitHub:
- ✅ Every push to `main` → automatic production deploy
- ✅ Pull requests → preview deployments
- ✅ Branch pushes → branch deployments

## Cost Considerations

### Vercel
- **Free tier**: 100GB bandwidth, 100 serverless functions
- **Pro tier**: $20/month for more resources

### API Costs
- **Gemini**: Free tier available, then pay-per-use
- **Statsig**: Free tier available, then subscription

## Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for all secrets
3. **Enable Vercel's security headers**
4. **Regularly rotate API keys**

## Performance Optimization

Your app is already optimized with:
- ✅ Next.js 15.5 with Turbopack
- ✅ Tailwind CSS for minimal bundle size
- ✅ Serverless functions for API routes
- ✅ Static generation where possible

## Support

If you run into issues:
1. Check Vercel deployment logs
2. Test locally with `npm run build`
3. Verify environment variables
4. Check API key permissions

---

**Ready to deploy?** Follow the steps above and your Optivise platform will be live in minutes! 🚀
