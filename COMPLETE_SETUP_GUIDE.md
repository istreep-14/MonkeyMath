# 🎯 MonkeyMath - Complete Setup Guide

## What You Have Now

I've set up **3 ways** to run MonkeyMath + **Google Sheets integration** for cloud storage!

---

## 🚀 Quick Start (Choose One)

### **Option 1: Run Locally** ⭐ RECOMMENDED

**Just double-click to run:**

**Mac:**
```bash
# Double-click this file:
start.command
```

**Windows:**
```bash
# Double-click this file:
start.bat
```

**What happens:**
1. Terminal opens
2. Dependencies install (first time only)
3. Browser opens automatically to http://localhost:5173
4. Start playing!

**To stop:** Press `Ctrl+C` in the terminal

---

### **Option 2: Deploy to Vercel** 🌐

**For online access from anywhere:**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/monkeymath.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your `monkeymath` repo
   - Click "Deploy"

3. **Done!** Your app is live at `https://your-project.vercel.app`

---

### **Option 3: Desktop App** 🖥️

**Create a real desktop application:**

See [ELECTRON_SETUP.md](ELECTRON_SETUP.md) for full instructions.

---

## 📊 Google Sheets Integration (HIGHLY RECOMMENDED)

### **Why Use Google Sheets?**

✅ **Cloud storage** - Access from any device  
✅ **Never lose data** - Automatic backups  
✅ **Easy to analyze** - Built-in charts and formulas  
✅ **Share with others** - Collaborate on data  
✅ **Export anytime** - Download as CSV/Excel  
✅ **Free forever** - No database costs  

### **Setup (5 Minutes):**

1. **Create Google Sheet** - [sheets.google.com](https://sheets.google.com)
2. **Add Apps Script** - Extensions → Apps Script
3. **Deploy as Web App** - Get your URL
4. **Configure in MonkeyMath** - Settings → Paste URL

**Full instructions:** [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

---

## 📥 Import Your Old Data

### **You have old data? Import it!**

**Required format:**
```csv
difficulty,date/time,score,duration
easy,2024-01-15 10:30,25,60
medium,2024-01-16 14:20,30,60
hard,2024-01-17 09:15,20,60
```

**How to import:**
1. Open MonkeyMath
2. Go to Dashboard
3. Click **📥 Import** button
4. Upload CSV or paste data
5. Click **Import Data**

**Full instructions:** [BACKFILL_OLD_DATA.md](BACKFILL_OLD_DATA.md)

---

## 🎮 How to Use MonkeyMath

### **1. Start a Test**
- Click "Start Test" in sidebar
- Choose duration, difficulty, operators
- Press Space or Enter to begin

### **2. Play**
- Type your answer
- Auto-submits when correct (no Enter needed!)
- Keep going until time runs out

### **3. View Results**
- See detailed performance charts
- QPM (Questions Per Minute)
- Accuracy percentage
- Smoothed line graph showing speed trends
- Red X marks on questions with mistakes

### **4. Track Progress**
- Dashboard shows all your games
- Click any game to see details
- View statistics and trends

---

## ⚙️ Features

### **In the App:**
- ⚙️ **Settings** - Configure Google Sheets
- 📥 **Import** - Load old data from CSV
- 📤 **Export** - Download data as CSV
- 📊 **Dashboard** - View all games and stats
- 📈 **Charts** - Interactive performance graphs

### **Data Storage:**
- 💾 **Local (IndexedDB)** - Always saves locally as backup
- ☁️ **Google Sheets** - Optional cloud sync
- 🔄 **Dual storage** - Best of both worlds!

### **Performance Tracking:**
- **QPM** - Questions per minute
- **Accuracy** - First-try correct percentage
- **Attempts** - Average tries per question
- **Keystroke analysis** - Tracks corrections
- **Time per question** - Detailed timing data

---

## 📁 Project Structure

```
monkeymath/
├── src/
│   ├── components/
│   │   ├── TestGame.jsx       # Main game component
│   │   ├── Results.jsx         # Results with charts
│   │   ├── Dashboard.jsx       # Overview and stats
│   │   ├── Settings.jsx        # Google Sheets config
│   │   ├── DataImport.jsx      # CSV import tool
│   │   └── DataExport.jsx      # CSV export tool
│   ├── utils/
│   │   ├── db.js               # IndexedDB utilities
│   │   └── googleSheets.js     # Google Sheets API
│   └── App.jsx                 # Main app
├── start.command               # Mac auto-start script ⭐
├── start.bat                   # Windows auto-start script
├── vercel.json                 # Vercel deployment config
├── GOOGLE_SHEETS_SETUP.md      # Google Sheets guide
├── BACKFILL_OLD_DATA.md        # Import old data guide
├── DEPLOYMENT.md               # Full deployment guide
├── LOCAL_RUNNING.md            # All local options
└── QUICK_START.md              # Quick reference
```

---

## 🎯 Recommended Workflow

### **For You (Local Use + Google Sheets):**

1. **✅ Set up local running**
   - Double-click `start.command`
   - Bookmark http://localhost:5173

2. **✅ Set up Google Sheets**
   - Follow [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
   - Configure in Settings

3. **✅ Import old data**
   - Follow [BACKFILL_OLD_DATA.md](BACKFILL_OLD_DATA.md)
   - Use CSV import

4. **✅ Start playing!**
   - Data saves to both local + Google Sheets
   - Never lose your progress
   - Analyze in Google Sheets anytime

---

## 📊 Data Flow

```
┌─────────────────┐
│  Play Game      │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│  IndexedDB      │  │  Google Sheets   │
│  (Local)        │  │  (Cloud)         │
└─────────────────┘  └──────────────────┘
         │                  │
         └──────────┬───────┘
                    │
                    ▼
         ┌─────────────────┐
         │  Dashboard      │
         │  Shows all data │
         └─────────────────┘
```

**Benefits:**
- ✅ Works offline (saves to IndexedDB)
- ✅ Syncs to cloud when online (Google Sheets)
- ✅ Never lose data (dual storage)
- ✅ Access from anywhere (Google Sheets)
- ✅ Easy to analyze (spreadsheet format)

---

## 🔧 Troubleshooting

### **App won't start**
- Make sure Node.js is installed: [nodejs.org](https://nodejs.org)
- Run: `npm install`
- Then: `./start.command`

### **Port already in use**
- Another app is using port 5173
- Kill it: `lsof -ti:5173 | xargs kill`
- Or change port in `vite.config.js`

### **Google Sheets not saving**
- Check Settings has correct URL
- URL should end with `/exec`
- Test connection in Settings
- Check Google Sheet for new rows

### **Import failed**
- Check CSV format matches template
- Headers must be: `difficulty,date/time,score,duration`
- No extra spaces or special characters

### **Data not showing**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check browser console (F12) for errors
- Clear browser cache

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [QUICK_START.md](QUICK_START.md) | Quick reference guide |
| [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) | Google Sheets integration |
| [BACKFILL_OLD_DATA.md](BACKFILL_OLD_DATA.md) | Import old data |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deploy to Vercel/Netlify/etc |
| [LOCAL_RUNNING.md](LOCAL_RUNNING.md) | All local running options |
| [ELECTRON_SETUP.md](ELECTRON_SETUP.md) | Create desktop app |

---

## ✅ Setup Checklist

### **Immediate (5 minutes):**
- [ ] Double-click `start.command` to test
- [ ] Play a test game
- [ ] Check Dashboard

### **Recommended (10 minutes):**
- [ ] Set up Google Sheets backend
- [ ] Configure URL in Settings
- [ ] Test connection
- [ ] Play a game and verify it saves to Sheets

### **Optional (if you have old data):**
- [ ] Format old data as CSV
- [ ] Import via Dashboard
- [ ] Verify data appears correctly

### **Optional (for online access):**
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Share URL with friends

---

## 🎉 You're All Set!

**To start using MonkeyMath right now:**

### **Mac:**
```bash
./start.command
```

### **Windows:**
```
start.bat
```

**Then:**
1. Browser opens automatically
2. Click "Start Test"
3. Choose your settings
4. Start playing!

---

## 💡 Pro Tips

**For best results:**
- ✅ Use Google Sheets for cloud storage
- ✅ Import your old data
- ✅ Play regularly to track improvement
- ✅ Check Dashboard to see progress
- ✅ Create charts in Google Sheets
- ✅ Export data anytime for backup

**For practice:**
- Start with Easy difficulty
- Gradually increase difficulty
- Track your QPM improvement
- Aim for >90% accuracy
- Practice daily for best results

---

**Happy calculating! 🧮✨**

Need help? Check the documentation files above or open an issue on GitHub!

