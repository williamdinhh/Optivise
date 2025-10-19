# Optivise - AI-Powered A/B Testing Platform

To Run:

# Clone and setup

git clone <your-repo-url>
cd Optivise
npm install

# Add your Gemini API key & Statsig Local + Secret Key

GEMINI_API_KEY== </br>
NEXT_PUBLIC_STATSIG_CLIENT_KEY= </br>
STATSIG_CONSOLE_KEY= </br>

> .env.local

# Start development server

npm run dev

````
Open [http://localhost:3000](http://localhost:3000) and start testing!

## ✨ What Makes Optivise Special

### 🤖 **Real AI-Generated Variants**
Unlike mock-ups, Optivise generates actual HTML/CSS code changes:
- Button colors, sizes, and animations
- Layout structures and typography
- Color schemes and visual hierarchy
- Feature additions and removals

### 📊 **Intelligent Analytics**
Get AI-powered insights with:
- Winner identification and statistical analysis
- Natural language recommendations
- Actionable next steps
- Interactive web-based visualizations

## 🎨 Key Features

### AI Variant Generation
- **Natural Language Input**: "Make the signup button more prominent"
- **Real Code Changes**: Actual HTML/CSS modifications, not just suggestions
- **🤖 AI-Powered Auto-Generation**: Gemini analyzes your current variant and generates intelligent, context-aware optimization suggestions
- **Smart Prompts**: AI creates specific, actionable prompts based on UX best practices
- **Multiple Variants**: Generate 1-3 variants simultaneously

### Live Preview System
- **Shadow DOM Implementation**: Isolated style rendering
- **Real-time Switching**: Instant variant comparison
-  See exactly what users will experience

### Real-Time Event Tracking
- **Automatic Impressions**: Tracked on every page load
- **Click Detection**: Buttons and interactive elements
- **5 Key Metrics**: Impressions, Clicks, CTR, Conversions, Conversion Rate
- **Memory Storage**: Fast, reliable event logging
- **Live Analytics**: Real-time performance data


## 🎯 How to Use

### Quick Start - Generate Your First Variant

1. **Go to Dashboard** - Click "Dashboard" from the home page
2. **Navigate to Variant Generator** - Select "Variant Generator" from the sidebar
3. **Choose Your Method**:

#### Method A: AI Auto-Generate (Recommended! 🤖)
- Click **"🤖 Auto-Generate with AI"** button
- The AI analyzes your current variant's HTML and CSS
- Gemini generates an intelligent, context-aware optimization suggestion
- Example: "Make the CTA button 30% larger with a pulsing animation"
- The prompt auto-fills and variants are generated automatically
- **No thinking required** - AI does all the creative work!

#### Method B: Custom Prompt
- Type your own optimization idea (e.g., "Change the hero background to gradient blue")
- Select how many variants to generate (1-3)
- Click "Generate Variants"

4. **Preview & Test** - Switch between variants to compare
5. **Track Performance** - Enable capture and interact with variants
6. **Analyze Results** - View metrics and AI-powered insights
7. **Apply Winner** - Deploy the best-performing variant

### Using the Standalone Website

- Click **"🌐 Open Website in New Tab"** from anywhere
- Share `/site` URL with team members or testers
- Each visitor sees a random active variant (real A/B testing simulation)
- All impressions and interactions are automatically tracked
- Perfect for gathering authentic user behavior data

## 🎯 Use Cases

### For Startups
- Test landing page variations quickly
- Optimize conversion funnels
- Learn what works before real traffic

### For Developers
- Prototype testing systems
- Template for real implementations
- Reference for AI integration

### For Learning
- Understand A/B testing principles
- Practice prompt engineering
- Study metrics interpretation

## 🚀 Deployment to Vercel

### Prerequisites
1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **API Keys**: Get your Gemini and Statsig keys

### Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/your-username/optivise.git
git push -u origin main
````

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? optivise
# - Directory? ./
# - Override settings? N
```

### Step 3: Configure Environment Variables

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

| Variable                         | Value                      | Environment                      |
| -------------------------------- | -------------------------- | -------------------------------- |
| `GEMINI_API_KEY`                 | `your_gemini_api_key`      | Production, Preview, Development |
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | `your_statsig_client_key`  | Production, Preview, Development |
| `STATSIG_CONSOLE_KEY`            | `your_statsig_console_key` | Production, Preview, Development |

### Step 4: Redeploy

After adding environment variables:

```bash
# If using CLI
vercel --prod

# Or trigger redeploy from Vercel dashboard
```

### 🎉 You're Live!

Your app will be available at: `https://your-project-name.vercel.app`

### 🔧 Build Configuration

Your `next.config.ts` is already optimized for Vercel. No changes needed!

### 📊 Monitoring Your Deployment

1. **Vercel Dashboard**: Monitor builds, deployments, and performance
2. **Function Logs**: Check API route logs in Vercel dashboard
3. **Analytics**: Built-in Vercel Analytics available

### 🚨 Troubleshooting

#### Build Fails

```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

#### Environment Variables Not Working

- Ensure variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

#### API Routes Not Working

- Verify API keys are correct
- Check Vercel function logs
- Test endpoints locally first

### 🔄 Continuous Deployment

Once connected to GitHub:

- Every push to `main` triggers automatic deployment
- Pull requests create preview deployments
- Branch deployments for testing

## 🔮 Future Enhancements

- Allow moderators or users to upload their own websites, rather than actually having to modify the code of website in the files

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/optivise)
