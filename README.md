# Optivise - AI-Powered A/B Testing Platform
Dubhacks 2025
### 👨‍💻 Made By

**William Dinh** – CS Student @ University of Washington <a href="https://www.linkedin.com/in/williamdinh/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="https://www.linkedin.com/in/williamdinh/" height="20" width="30" /></a>
</p>
**Sidiq Moltafet** – CS Student @ University of Washington

# Clone and setup

git clone <your-repo-url> </br>
cd Optivise </br>
npm install </br>

# Add your Gemini API key & Statsig Local + Secret Key

GEMINI_API_KEY= </br>
NEXT_PUBLIC_STATSIG_CLIENT_KEY= </br>
STATSIG_CONSOLE_KEY= </br>

> .env.local

# Start development server

npm run dev


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
- **Memory Storage**: Fast, reliable event logging with Statsig
- **Live Analytics**: Real-time performance data

### Using the Standalone Website

- Click **"🌐 Open Website in New Tab"** from anywhere
- Share `/site` URL with team members or testers
- Each visitor sees a random active variant (real A/B testing simulation)
- All impressions and interactions are automatically tracked
- Perfect for gathering authentic user behavior data

## 🚀 Deployment to Vercel

### Prerequisites
1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at https://vercel.com
3. **API Keys**: Get your Gemini and Statsig keys

# Initialize git if not already done
### Step 1: Prepare Your Repository
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/your-username/optivise.git
git push -u origin main

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### Step 3: Configure Environment Variables

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

| Variable                         | Value                      | Environment                      |
| -------------------------------- | -------------------------- | -------------------------------- |
| `GEMINI_API_KEY`                 | `your_gemini_api_key`      | Production, Preview, Development |
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | `your_statsig_client_key`  | Production, Preview, Development |
| `STATSIG_CONSOLE_KEY`            | `your_statsig_console_key` | Production, Preview, Development |

### Step 4: Redeploy

After adding environment variables:

### 🎉 You're Live!

Your app will be available at: `https://your-project-name.vercel.app`

### 🔧 Build Configuration

Your `next.config.ts` is already optimized for Vercel. No changes needed!

### 📊 Monitoring Your Deployment

1. **Vercel Dashboard**: Monitor builds, deployments, and performance
2. **Function Logs**: Check API route logs in Vercel dashboard
3. **Analytics**: Built-in Vercel Analytics available

## 🔮 Future Enhancements
- Allow moderators or users to upload their own websites, rather than actually having to modify the code of website in the files
