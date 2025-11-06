# MonkeyMath Deployment Guide

## 🚀 Quick Deploy (Recommended)

### Option 1: Netlify (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/monkeymath.git
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Done!** Your site will be live at `https://YOUR_SITE_NAME.netlify.app`

**Custom Domain (Optional):**
- Go to Site settings → Domain management
- Add your custom domain

---

### Option 2: Vercel (Best Performance)

1. **Push to GitHub** (same as above)

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"

3. **Done!** Live at `https://YOUR_PROJECT.vercel.app`

---

### Option 3: GitHub Pages (Free Static Hosting)

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/monkeymath",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/monkeymath/'  // Add this line
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Save

6. **Done!** Live at `https://YOUR_USERNAME.github.io/monkeymath`

---

## 📦 Build for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder contains your production-ready app.

---

## 🌐 Custom Domain Setup

### Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records at your domain provider:
   - Type: `CNAME`
   - Name: `www` (or `@` for root)
   - Value: `YOUR_SITE.netlify.app`

### Vercel:
1. Go to Project settings → Domains
2. Add your domain
3. Follow DNS instructions

---

## 🔧 Environment Variables (Future)

If you add backend features (Firebase, Supabase, etc.):

1. Create `.env` file:
   ```
   VITE_API_KEY=your_api_key
   VITE_API_URL=your_api_url
   ```

2. Access in code:
   ```javascript
   const apiKey = import.meta.env.VITE_API_KEY
   ```

3. Add to `.gitignore`:
   ```
   .env
   .env.local
   ```

4. Set in Netlify/Vercel:
   - Netlify: Site settings → Environment variables
   - Vercel: Project settings → Environment Variables

---

## 📱 PWA (Progressive Web App)

To make MonkeyMath installable on mobile:

1. **Install Vite PWA plugin:**
   ```bash
   npm install vite-plugin-pwa -D
   ```

2. **Update vite.config.js:**
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa'
   
   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'MonkeyMath',
           short_name: 'MonkeyMath',
           description: 'Master arithmetic with speed and precision',
           theme_color: '#e2b714',
           icons: [
             {
               src: 'icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: 'icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   })
   ```

3. **Add icons** to `public/` folder

---

## 🎯 Performance Tips

1. **Lazy load components:**
   ```javascript
   const Dashboard = lazy(() => import('./components/Dashboard'))
   ```

2. **Optimize images** (if you add any)

3. **Enable compression** on your hosting platform

4. **Use CDN** for static assets

---

## 🐛 Troubleshooting

**Build fails:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --force`

**IndexedDB not working:**
- Check browser compatibility
- Ensure HTTPS (required for some browsers)

**Blank page after deploy:**
- Check `base` in vite.config.js
- Check browser console for errors
- Verify build output in `dist/`

---

## 📊 Analytics (Optional)

Add Google Analytics or Plausible:

```bash
npm install @vercel/analytics
```

```javascript
// In main.jsx
import { Analytics } from '@vercel/analytics/react'

<App />
<Analytics />
```

---

## 🔐 Security Notes

- IndexedDB data is **local only** (not synced)
- No sensitive data is stored
- No authentication required
- Safe to deploy publicly

---

## 🚀 Next Steps

After deployment, consider:
1. ✅ Share with friends
2. ✅ Add to home screen (PWA)
3. ✅ Track your progress
4. 🔜 Add cloud sync (Firebase/Supabase)
5. 🔜 Add multiplayer mode
6. 🔜 Create mobile app

---

## 📞 Support

- **Issues:** Create GitHub issue
- **Questions:** Check README.md
- **Updates:** `git pull && npm install && npm run build`

