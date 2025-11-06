# 🚀 MonkeyMath - Quick Start Guide

## 🎯 Choose Your Method

### **Option A: Run Locally (No Deployment)** ⭐ EASIEST

**Just want to use it on your computer?**

#### **Mac Users:**
1. **Double-click `start.command`** in the project folder
2. That's it! Browser opens automatically at http://localhost:5173

#### **Windows Users:**
1. **Double-click `start.bat`** in the project folder
2. That's it! Browser opens automatically at http://localhost:5173

**First time:** It will install dependencies (takes 1-2 minutes)  
**After that:** Starts instantly!

**To stop:** Press `Ctrl+C` in the terminal window

---

### **Option B: Deploy to Vercel (Online)** 🌐

**Want to access it from anywhere?**

#### **Step 1: Push to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/monkeymath.git
git push -u origin main
```

#### **Step 2: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `monkeymath` repo
5. Click **"Deploy"**

**Done!** Your app is live at `https://your-project.vercel.app`

**Auto-deploys:** Every time you push to GitHub, Vercel auto-updates!

---

### **Option C: Desktop App (Advanced)** 🖥️

**Want a real desktop application?**

See [ELECTRON_SETUP.md](ELECTRON_SETUP.md) for full instructions.

**Quick version:**
```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
# Follow ELECTRON_SETUP.md
npm run package:mac  # Creates MonkeyMath.app
```

**Result:** Drag `MonkeyMath.app` to Applications folder, double-click to run!

---

## 📊 What You Get

### **Local Running:**
✅ Works offline  
✅ No internet needed  
✅ Instant startup  
✅ Data stays on your computer  
❌ Only accessible on this computer  

### **Vercel Deployment:**
✅ Access from anywhere  
✅ Share with friends  
✅ Auto-updates when you push code  
✅ Free SSL (HTTPS)  
❌ Requires internet  
❌ Data still local (IndexedDB in browser)  

### **Desktop App:**
✅ Feels like a real app  
✅ Works offline  
✅ No terminal needed  
✅ Can add to Dock/Taskbar  
❌ Larger file size (~150MB)  

---

## 🎮 How to Use MonkeyMath

1. **Start Test** - Click "Start Test" in sidebar
2. **Configure** - Choose duration, difficulty, operators
3. **Play** - Type answers (auto-submits when correct)
4. **Results** - View detailed performance charts
5. **Dashboard** - See your progress over time

---

## 🔧 Troubleshooting

### **"npm: command not found"**
Install Node.js from [nodejs.org](https://nodejs.org)

### **Port 5173 already in use**
Another app is using that port. Either:
- Stop the other app
- Or change port in `vite.config.js`:
  ```javascript
  export default defineConfig({
    server: { port: 3000 }
  })
  ```

### **Browser doesn't open automatically**
Manually open: http://localhost:5173

### **IndexedDB not working**
- Use Chrome or Firefox
- Make sure you're on `localhost` (not `file://`)

### **Changes not showing**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear browser cache

---

## 📁 Project Structure

```
monkeymath/
├── src/
│   ├── components/     # React components
│   ├── utils/          # Database utilities
│   └── App.jsx         # Main app
├── public/             # Static assets
├── dist/               # Built files (after npm run build)
├── start.command       # Mac auto-start script
├── start.bat           # Windows auto-start script
├── vercel.json         # Vercel config
└── package.json        # Dependencies
```

---

## 🎯 Next Steps

### **After Local Setup:**
- [ ] Play a few games
- [ ] Check the Dashboard
- [ ] Try different difficulty levels

### **After Vercel Deployment:**
- [ ] Share the URL with friends
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)

### **Future Enhancements:**
- [ ] Add user accounts (Firebase)
- [ ] Add multiplayer mode
- [ ] Create mobile app (PWA)
- [ ] Add leaderboards

---

## 💡 Tips

**For Best Performance:**
- Use Chrome or Firefox
- Close other tabs
- Use fullscreen mode

**For Practice:**
- Start with Easy difficulty
- Gradually increase difficulty
- Track your QPM improvement
- Aim for >90% accuracy

**For Development:**
- Edit files in `src/`
- Changes auto-reload
- Check browser console for errors

---

## 📞 Need Help?

**Common Issues:**
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Check browser console (F12)
- Restart the dev server

**Deployment:**
- See [DEPLOYMENT.md](DEPLOYMENT.md)
- See [LOCAL_RUNNING.md](LOCAL_RUNNING.md)

**Desktop App:**
- See [ELECTRON_SETUP.md](ELECTRON_SETUP.md)

---

## 🎉 You're Ready!

**To start using MonkeyMath right now:**

### Mac:
```bash
# Just double-click start.command
# Or in terminal:
./start.command
```

### Windows:
```
REM Just double-click start.bat
REM Or in command prompt:
start.bat
```

### Or deploy to Vercel:
```bash
git push  # Auto-deploys!
```

**Happy calculating! 🧮✨**

