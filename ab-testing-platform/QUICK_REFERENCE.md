# Quick Reference Card

## 🚀 Essential Commands

```bash
# Start development server
npm run dev

# Run terminal analytics
npm run analyze

# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Important URLs

```
Web Interface:     http://localhost:3000
API Base:          http://localhost:3000/api
```

---

## 🔑 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/variants/generate` | POST | Generate new variants |
| `/api/variants` | GET | List all variants |
| `/api/variants` | DELETE | Delete a variant |
| `/api/variants` | PATCH | Update variant |
| `/api/simulate` | POST | Run user simulation |
| `/api/analyze` | POST | Get AI analysis |
| `/api/config` | GET | Get configuration |
| `/api/config` | POST | Set current variant |

---

## 📋 Workflow Checklist

- [ ] 1. Start dev server (`npm run dev`)
- [ ] 2. Generate variants (auto or custom prompt)
- [ ] 3. Review variants in dashboard
- [ ] 4. Activate/deactivate as needed
- [ ] 5. Run simulation
- [ ] 6. Open new terminal
- [ ] 7. Run analysis (`npm run analyze`)
- [ ] 8. Review results
- [ ] 9. Apply winner or iterate

---

## 💡 Example Prompts

### Color Changes
```
"Change the button to bright green"
"Use a blue and white color scheme"
"Make the background a gradient from purple to blue"
```

### Layout Changes
```
"Center all content"
"Put the features section above the CTA"
"Use a 2-column layout"
```

### Size Changes
```
"Make the button 50% larger"
"Increase all font sizes by 20%"
"Add more padding and spacing"
```

### Style Changes
```
"Switch to a minimalist design"
"Make it look more modern"
"Add subtle animations and shadows"
```

---

## 📊 Metrics Reference

| Metric | Good Range | What It Means |
|--------|-----------|---------------|
| CTR | 5-12% | Click-through rate |
| Conversion Rate | 2-8% | Success rate |
| Time on Page | 60-120s | Engagement |
| Bounce Rate | 30-50% | Exit rate (lower is better) |
| Impressions | 1000+ | Total views |

---

## 🎯 Terminal Analytics Options

```
1. Text Summary Only
   → AI insights and recommendations

2. Visual Dashboard
   → ASCII charts and tables

3. Both (Detailed View)
   → Complete analysis
```

---

## 🔧 Quick Fixes

### App won't start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Need to reset data
```bash
rm -rf data/
# Restart server to regenerate
```

### API key issues
```bash
# Check if file exists
cat .env.local

# Or recreate it
echo "OPENAI_API_KEY=sk-your-key" > .env.local
```

### Port conflict
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 📂 Project Structure

```
ab-testing-platform/
├── app/                    # Next.js pages & API
│   ├── api/               # Backend endpoints
│   └── page.tsx           # Main UI
├── components/            # React components
├── lib/                   # Core logic
│   ├── openai.ts         # AI integration
│   ├── simulator.ts      # Data generation
│   └── storage.ts        # File storage
├── scripts/
│   └── analyze.ts        # Terminal CLI
├── types/                # TypeScript types
└── data/                 # Generated data
    └── config.json       # Variants storage
```

---

## 🎨 Key Features

✅ AI variant generation with real HTML/CSS changes
✅ Auto-generate optimal variants
✅ Synthetic user data simulation
✅ AI-powered analysis
✅ Terminal analytics interface
✅ ASCII visualizations
✅ Variant management (activate/delete)
✅ Apply winning variants
✅ Live preview with Shadow DOM

---

## 🔒 Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important**: 
- Don't commit `.env.local` to git
- Restart server after changing
- Use `.env.example` as template

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "API key not configured" | Create `.env.local` with key |
| "No variants with metrics" | Run simulation first |
| "ECONNREFUSED" | Start dev server first |
| Variants too similar | Be more specific in prompts |
| Port 3000 in use | Kill process or use different port |

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **QUICKSTART.md** - 5-minute setup
- **PROJECT_SUMMARY.md** - Technical overview
- **FEATURES.md** - Feature descriptions
- **TROUBLESHOOTING.md** - Problem solving
- **QUICK_REFERENCE.md** - This file

---

## 💻 Development Tips

```bash
# Watch logs
npm run dev | tee dev.log

# Check TypeScript
npx tsc --noEmit

# Format code (if prettier installed)
npx prettier --write .

# Check bundle size
npm run build
```

---

## 🎓 Learning Path

1. **Start Simple**: Use auto-generate first
2. **Explore Prompts**: Try different prompt types
3. **Analyze Results**: Understand metrics
4. **Iterate**: Apply insights to new variants
5. **Customize**: Modify code for your needs

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
1. Build: `npm run build`
2. Upload dist files
3. Set `OPENAI_API_KEY` env var
4. Start: `npm start`

---

## 📞 Resources

- Next.js: https://nextjs.org/docs
- OpenAI: https://platform.openai.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind: https://tailwindcss.com/docs

---

## 🎯 Success Metrics

**You'll know it's working when**:
- ✅ Variants show visible differences
- ✅ Metrics differ between variants
- ✅ AI provides actionable insights
- ✅ Terminal displays charts correctly
- ✅ Applying winner changes default

---

**Print this card and keep it handy!** 📄

For detailed info, see README.md or other documentation files.

