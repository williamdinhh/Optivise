# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 "OpenAI API key not configured"

**Problem**: The application can't find your OpenAI API key.

**Solutions**:
1. Check if `.env.local` file exists in project root
   ```bash
   ls -la .env.local
   ```

2. If missing, create it:
   ```bash
   echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
   ```

3. Verify the key format:
   - Must start with `sk-`
   - No quotes around the key
   - No extra spaces

4. Restart the dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

5. Check the key is valid at [OpenAI Platform](https://platform.openai.com/api-keys)

---

### 🔴 "No variants with metrics found"

**Problem**: Trying to analyze before running simulation.

**Solutions**:
1. Go to http://localhost:3000
2. Scroll to "User Data Simulation" section
3. Click "Run Simulation" button
4. Wait for success message
5. Then run `npm run analyze` again

**Prevention**:
Always run simulation before analysis.

---

### 🔴 Terminal analysis command fails with ECONNREFUSED

**Problem**: Dev server is not running.

**Solutions**:
1. Open a new terminal window/tab
2. Navigate to project:
   ```bash
   cd /Users/sidiq/Documents/Optivise/ab-testing-platform
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. Keep this terminal open
5. In another terminal, run:
   ```bash
   npm run analyze
   ```

**Note**: You need TWO terminals:
- Terminal 1: Running `npm run dev` (stays open)
- Terminal 2: Running `npm run analyze` (for analysis)

---

### 🔴 Variants don't show real changes

**Problem**: Generated variants look too similar to original.

**Solutions**:
1. **Be more specific in prompts**:
   - ❌ Bad: "make it better"
   - ✅ Good: "change button to bright green and make it 50% larger"

2. **Use auto-generate feature**:
   - Click "Auto-Generate Optimal Variants"
   - AI will make significant, researched changes

3. **Increase variant count**:
   - Change from 1 to 2 or 3 variants
   - More variants = more diversity

4. **Try different prompt categories**:
   - Color: "Change color scheme to blue and orange"
   - Layout: "Rearrange sections with features above CTA"
   - Size: "Make all text 20% larger"
   - Style: "Switch to minimalist design with more whitespace"

---

### 🔴 Build fails or errors on start

**Problem**: Missing dependencies or configuration issues.

**Solutions**:
1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

4. Update to latest Node if needed:
   ```bash
   # Using nvm
   nvm install --lts
   nvm use --lts
   ```

5. Reinstall all dependencies fresh:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### 🔴 Port 3000 already in use

**Problem**: Another application is using port 3000.

**Solutions**:
1. Find and kill the process:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. Or use a different port:
   ```bash
   PORT=3001 npm run dev
   ```
   Then access at http://localhost:3001

---

### 🔴 Simulation generates same results

**Problem**: Data looks identical across variants.

**Solutions**:
This is actually unlikely due to the randomization algorithm, but if it happens:

1. Run simulation again (it uses randomness)
2. Make sure variants are different (check preview)
3. Ensure multiple variants are active
4. Check that variants have different IDs

---

### 🔴 Cannot delete a variant

**Problem**: Delete button doesn't work or variant won't delete.

**Solutions**:
1. **If it's the "Original" variant**:
   - You cannot delete the original - this is by design
   - Only generated variants can be deleted

2. **If it's a generated variant**:
   - Make sure you're not viewing it (switch to another variant first)
   - Refresh the page and try again
   - Check browser console for errors (F12)

---

### 🔴 Terminal shows "command not found: npm"

**Problem**: Node.js/npm not installed or not in PATH.

**Solutions**:
1. Install Node.js:
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use nvm: `nvm install --lts`

2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

3. Restart terminal after installation

---

### 🔴 "Module not found" errors

**Problem**: Missing dependencies.

**Solutions**:
1. Install dependencies:
   ```bash
   npm install
   ```

2. If specific module is missing:
   ```bash
   npm install [module-name]
   ```

3. Clear cache and reinstall:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### 🔴 TypeScript errors in editor

**Problem**: Red squiggly lines in VS Code or other editors.

**Solutions**:
1. **These are often false positives** - if the build works, ignore them

2. Restart TypeScript server (VS Code):
   - Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

3. Close and reopen the project

4. Check if build actually works:
   ```bash
   npm run build
   ```
   If build succeeds, the code is fine

---

### 🔴 Slow AI generation

**Problem**: Variants take too long to generate.

**Reasons & Solutions**:
1. **This is normal**: AI generation takes 15-30 seconds
2. **Check your internet**: AI API requires internet connection
3. **OpenAI API status**: Check [status.openai.com](https://status.openai.com/)
4. **Reduce variant count**: Generate 1-2 instead of 3

---

### 🔴 Data directory not found

**Problem**: Terminal analysis says data directory doesn't exist.

**Solutions**:
1. Run the web app first:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000 in browser

3. This creates the data directory automatically

4. Then run analysis

---

### 🔴 Styles look broken

**Problem**: Website preview doesn't look right.

**Solutions**:
1. **Hard refresh browser**:
   - Mac: Cmd+Shift+R
   - Windows: Ctrl+Shift+R

2. **Clear browser cache**:
   - Open Dev Tools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check if CSS is loaded**:
   - Open browser Dev Tools
   - Check Console for errors

4. **Restart dev server**:
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

---

## 🔍 Debug Mode

### Enable Verbose Logging

1. **Browser Console**:
   - Press F12
   - Go to Console tab
   - Look for errors or warnings

2. **Server Logs**:
   - Check the terminal running `npm run dev`
   - Look for error messages in red

3. **API Responses**:
   - In browser Dev Tools, go to Network tab
   - Check API call responses
   - Look for 400/500 errors

### Check Data Files

```bash
# View current configuration
cat data/config.json | json_pp

# Or just view raw
cat data/config.json
```

---

## 💡 Performance Tips

### Speed Up Development

1. **Use smaller variant counts**: Generate 1-2 instead of 3
2. **Cache API responses**: Comment out API calls during UI development
3. **Use Turbopack**: Already enabled in this project
4. **Close unused tabs**: Browser performance matters

### Optimize Build

```bash
# Production build
npm run build

# Test production locally
npm start
```

---

## 🆘 Still Having Issues?

### Gather Information

1. **Node version**: `node --version`
2. **npm version**: `npm --version`
3. **Operating System**: Mac/Windows/Linux
4. **Error message**: Full text of the error
5. **Steps to reproduce**: What did you do before the error?

### Check These Files

1. `.env.local` - API key configured?
2. `package.json` - Dependencies installed?
3. `data/config.json` - Valid JSON?
4. `tsconfig.json` - Correct configuration?

### Clean Slate Approach

If nothing works, start fresh:

```bash
# 1. Backup your .env.local
cp .env.local .env.local.backup

# 2. Delete everything except source code
rm -rf node_modules .next data package-lock.json

# 3. Reinstall
npm install

# 4. Restore API key
cp .env.local.backup .env.local

# 5. Start fresh
npm run dev
```

---

## 📞 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Node.js Issues**: https://nodejs.org/en/docs/
- **TypeScript Help**: https://www.typescriptlang.org/docs/

---

**Most issues can be solved by**:
1. Restarting the dev server
2. Clearing cache
3. Reinstalling dependencies
4. Checking the .env.local file

If you've tried all these and still stuck, double-check the README.md for setup instructions!

