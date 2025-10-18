# AI-Powered A/B Testing Platform

A hackathon-ready prototype for AI-driven website variant generation, synthetic user testing, and intelligent analysis with terminal-based analytics viewing.

## 🚀 Features

- **AI Variant Generation**: Input natural language prompts to generate real HTML/CSS variants
- **Auto-Generation**: Click a button to let AI suggest optimal changes
- **Synthetic User Simulation**: Generate realistic user interaction data
- **AI Analysis**: Get intelligent insights and recommendations
- **Terminal Analytics**: View results as text summaries or ASCII visualizations
- **Variant Management**: Activate, deactivate, or delete variants
- **Live Preview**: See changes in real-time

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key

## 🛠️ Setup

1. **Clone/Navigate to the project**:
   ```bash
   cd /Users/sidiq/Documents/Optivise/ab-testing-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure OpenAI API**:
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Step 1: Generate Variants

**Option A - Manual Prompt:**
1. In the "AI Variant Generator" panel, describe the changes you want
2. Example prompts:
   - "Make the signup button larger and change it to green"
   - "Add more whitespace and improve the typography"
   - "Make the call-to-action more prominent"
3. Select how many variants to generate (1-3)
4. Click "Generate Variants"

**Option B - Auto-Generate:**
1. Click "Auto-Generate Optimal Variants"
2. AI will automatically suggest and create optimized variants

### Step 2: Review Variants

1. All variants appear in the "Variants" panel
2. Click on any variant to preview it
3. Use the buttons to:
   - **Activate/Deactivate**: Toggle variant participation in tests
   - **Delete**: Remove variants you don't want

### Step 3: Run Simulation

1. Scroll to "User Data Simulation" panel
2. Click "Run Simulation"
3. Synthetic user data will be generated for all active variants

### Step 4: Analyze Results

#### Terminal Analysis (Recommended)

1. Open a new terminal in the project directory
2. Run the analysis command:
   ```bash
   npm run analyze
   ```
3. Choose your viewing preference:
   - **Text Summary Only**: AI insights and recommendations
   - **Visual Dashboard**: ASCII charts and metrics tables
   - **Both**: Complete detailed view

4. Review the results and choose an action:
   - **Apply winning variant**: Make the best-performing variant the default
   - **View analysis again**: Re-run the analysis
   - **Exit**: Return to making changes

#### Web Interface Analysis

Analysis data is also available through the web interface after simulation.

## 📊 What Gets Analyzed

The platform tracks and analyzes:

- **Click-Through Rate (CTR)**: Percentage of users who click on elements
- **Conversion Rate**: Percentage of clicks that lead to conversions
- **Average Time on Page**: How long users stay on the page
- **Bounce Rate**: Percentage of users who leave immediately
- **Impressions**: Total number of page views
- **Conversions**: Total successful conversions

## 🔄 Iteration Workflow

1. Generate variants
2. Run simulation
3. Analyze results
4. Apply winning variant OR
5. Generate new variants based on insights
6. Repeat

## 🗂️ Project Structure

```
ab-testing-platform/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── analyze/          # Analysis endpoint
│   │   ├── config/           # Configuration management
│   │   ├── simulate/         # Data simulation
│   │   └── variants/         # Variant CRUD operations
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── DemoWebsite.tsx       # Live preview component
│   ├── ModeratorDashboard.tsx # Variant management UI
│   └── SimulationPanel.tsx   # Simulation controls
├── lib/                      # Core libraries
│   ├── openai.ts             # OpenAI API integration
│   ├── simulator.ts          # User data simulation
│   └── storage.ts            # Data persistence
├── scripts/                  # CLI scripts
│   └── analyze.ts            # Terminal analysis tool
├── types/                    # TypeScript type definitions
│   └── index.ts
├── data/                     # Data storage (auto-generated)
│   └── config.json           # Variants and configuration
└── README.md                 # This file
```

## 🎨 How AI Variant Generation Works

The system uses GPT-4 to:
1. Parse your natural language prompt
2. Analyze the current HTML/CSS
3. Generate variants with real, tangible changes:
   - Different layouts and structures
   - Color scheme variations
   - Typography changes
   - Button styles and sizes
   - Content hierarchy adjustments
   - Feature additions/modifications

Each variant maintains valid HTML/CSS while implementing meaningful UX improvements.

## 📈 Simulation Algorithm

The synthetic user data generator:
- Creates realistic metrics with statistical variation
- Ensures different variants have meaningfully different results
- Simulates 1000-1500 impressions per variant
- Generates CTRs between 2-12%
- Produces conversion rates between 1-8%
- Calculates realistic time-on-page and bounce rates

## 🤖 AI Analysis

The AI analyzer:
1. Examines all metrics across variants
2. Identifies the winning variant based on:
   - Conversion rate (primary)
   - Click-through rate
   - Time on page
   - Bounce rate
3. Provides actionable insights
4. Recommends next steps

## 🛡️ API Endpoints

- `POST /api/variants/generate` - Generate variants from prompt
- `GET /api/variants` - List all variants
- `DELETE /api/variants` - Delete a variant
- `PATCH /api/variants` - Update variant properties
- `POST /api/simulate` - Run user data simulation
- `POST /api/analyze` - Analyze variant performance
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update current variant

## 🐛 Troubleshooting

### "OpenAI API key not configured"
- Ensure `.env.local` exists with a valid `OPENAI_API_KEY`
- Restart the dev server after adding the key

### "No variants with metrics found"
- Run a simulation first via the web interface
- Make sure at least one variant is active

### Terminal command not working
- Ensure the dev server is running (`npm run dev`)
- Check that port 3000 is available

### Variants not showing real changes
- Check that your prompt is specific
- Try the "Auto-Generate" feature
- Review the generated variant in the preview

## 📝 Example Prompts

**Good prompts:**
- "Make the call-to-action button bigger, brighter, and centered"
- "Change the color scheme to blue and white, make it more modern"
- "Add a feature list with icons before the CTA button"
- "Increase font sizes and add more spacing for better readability"

**Too vague:**
- "Make it better"
- "Improve conversion"

## 🚀 Deployment

To deploy this application:

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy to Vercel (recommended):
   ```bash
   npx vercel
   ```

3. Or use any Node.js hosting platform that supports Next.js

4. Remember to set the `OPENAI_API_KEY` environment variable in your hosting platform

## 🤝 Contributing

This is a hackathon prototype. Feel free to:
- Add more metrics
- Improve the AI prompts
- Enhance visualizations
- Add real user tracking
- Implement more sophisticated simulation algorithms

## 📄 License

MIT License - feel free to use this for your projects!

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [A/B Testing Best Practices](https://www.optimizely.com/optimization-glossary/ab-testing/)
- [Conversion Rate Optimization](https://cxl.com/conversion-rate-optimization/)

## 💡 Tips for Best Results

1. **Be Specific**: The more detailed your prompt, the better the results
2. **Iterate**: Use insights from one round to inform the next
3. **Test Multiple Variants**: Compare 2-3 variants at a time
4. **Focus on One Change**: Test one major change at a time for clear insights
5. **Use Auto-Generate**: Let AI suggest optimizations based on best practices

---

Built with ❤️ for hackathons and rapid prototyping
