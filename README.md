# Optivise - AI-Powered A/B Testing Platform

To Run:

# Clone and setup
git clone <your-repo-url>
cd Optivise
npm install

# Add your Gemini API key & Statsig Local + Secret Key
GEMINI_API_KEY==
NEXT_PUBLIC_STATSIG_CLIENT_KEY=
STATSIG_CONSOLE_KEY=
> .env.local

# Start development server
npm run dev
```
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
- Terminal-based visualizations

### 🎯 **Complete Testing Workflow**
1. **Generate** variants with natural language prompts
2. **Preview** changes in real-time with Shadow DOM
3. **Simulate** realistic user behavior data
4. **Analyze** results with AI-powered insights
5. **Apply** winning variants instantly

## 🎨 Key Features

### AI Variant Generation
- **Natural Language Input**: "Make the signup button more prominent"
- **Real Code Changes**: Actual HTML/CSS modifications, not just suggestions
- **Auto-Generation**: One-click optimal variant suggestions
- **Multiple Variants**: Generate 1-3 variants simultaneously

### Live Preview System
- **Shadow DOM Implementation**: Isolated style rendering
- **Real-time Switching**: Instant variant comparison
- **True WYSIWYG**: See exactly what users will experience
- **Responsive Design**: Works on all screen sizes

### Synthetic User Simulation
- **Realistic Metrics**: Statistically plausible data
- **7 Key Metrics**: Impressions, CTR, conversions, time on page, bounce rate
- **Meaningful Variation**: Different performance across variants
- **Instant Generation**: < 1 second simulation time

### Terminal Analytics Interface
- **Three Viewing Modes**:
  - Text summary only
  - ASCII visualizations (bar charts)
  - Complete detailed view
- **Interactive Prompts**: Choose your preferred output format
- **Color-coded Output**: Easy-to-read results
- **One-click Application**: Apply winners directly

## 🏗️ Architecture

### Frontend (Next.js + React)
- **Main Dashboard**: Orchestrates all components
- **Demo Website**: Renders variants using Shadow DOM
- **Moderator Panel**: Variant management and controls
- **Analytics Panel**: Real-time metrics display

### Backend (Next.js API Routes)
- **`/api/variants/generate`**: AI variant generation
- **`/api/variants`**: CRUD operations for variants
- **`/api/analyze`**: AI-powered analysis and insights
- **`/api/events`**: Event tracking and simulation
- **`/api/config`**: Configuration management

### Core Libraries
- **`lib/ai.ts`**: OpenAI API integration
- **`lib/event-tracker.ts`**: User behavior simulation
- **`lib/storage.ts`**: File-based data persistence
- **`lib/statsig-*.ts`**: Analytics and feature flagging

## 📊 Metrics Tracked

| Metric | Description | Good Range |
|--------|-------------|------------|
| **Impressions** | Total page views | 1000-1500 |
| **Click-Through Rate** | Percentage who clicked | 5-12% |
| **Conversion Rate** | Percentage who converted | 2-8% |
| **Avg Time on Page** | Engagement duration | 60-120s |
| **Bounce Rate** | Immediate exits | 30-50% |

## 📁 Project Structure

```
Optivise/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   ├── dashboard/         # Main dashboard page
│   └── test-analytics/    # Analytics testing page
├── components/            # React components
│   ├── AnalyticsPanel.tsx
│   ├── CapturePanel.tsx
│   ├── DemoWebsite.tsx
│   ├── ModeratorDashboard.tsx
│   └── StatsigProvider.tsx
├── lib/                   # Core libraries
│   ├── ai.ts             # AI integration
│   ├── event-tracker.ts  # Event tracking
│   ├── storage.ts        # Data persistence
│   └── statsig-*.ts      # Analytics integration
├── data/                  # Generated data
│   ├── config.json       # Variants storage
│   ├── events.json       # Event data
│   └── history.json      # Historical data
├── scripts/              # CLI tools
│   └── analyze.ts        # Terminal analytics
└── types/                # TypeScript definitions
    └── index.ts
```


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
```

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

| Variable | Value | Environment |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `your_gemini_api_key` | Production, Preview, Development |
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | `your_statsig_client_key` | Production, Preview, Development |
| `STATSIG_CONSOLE_KEY` | `your_statsig_console_key` | Production, Preview, Development |

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

- [ ] Real user tracking integration
- [ ] Advanced visualizations in web UI
- [ ] Multi-page testing support
- [ ] Database integration (PostgreSQL)
- [ ] Multi-user authentication
- [ ] Export reports (PDF, CSV)
- [ ] Real-time metrics updates
- [ ] Version control for variants

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Statsig for analytics platform
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling

## 📞 Support

- 📖 **Documentation**: See `docs/` folder for detailed guides
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Join GitHub Discussions for questions
- 📧 **Contact**: [Your contact information]

---

**Built with ❤️ for developers who want to move fast and build amazing things.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/optivise)
