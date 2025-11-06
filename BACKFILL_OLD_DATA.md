# 📥 How to Backfill Your Old MonkeyMath Data

## You Have Old Data? Perfect! Here's How to Import It

Since you mentioned you have old data with:
- **Difficulty**
- **Date/Time**
- **Score (questions)**
- **Duration**

Let me show you the **easiest way** to get it into MonkeyMath!

---

## 🎯 Method 1: Import via CSV (EASIEST)

### **Step 1: Format Your Data**

Create a CSV file with this exact format:

```csv
difficulty,date/time,score,duration
easy,2024-01-15 10:30,25,60
medium,2024-01-16 14:20,30,60
hard,2024-01-17 09:15,20,60
easy,2024-01-18 11:00,28,60
medium,2024-01-19 15:30,32,60
```

**Column details:**
- `difficulty` - easy, medium, or hard
- `date/time` - Any format works: `2024-01-15`, `1/15/2024`, `Jan 15 2024`, etc.
- `score` - Number of questions answered
- `duration` - Test duration in seconds (usually 60)

### **Step 2: Import in MonkeyMath**

1. **Open MonkeyMath** (double-click `start.command`)
2. Go to **Dashboard**
3. Click the **📥 Import** button (top right)
4. Either:
   - **Upload your CSV file**, OR
   - **Paste the CSV data** directly
5. Click **Import Data**

**Done!** Your old data is now in MonkeyMath! 🎉

---

## 🎯 Method 2: Import Directly to Google Sheets (BEST FOR LONG-TERM)

If you want your data in Google Sheets from the start:

### **Step 1: Set Up Google Sheets Backend**

Follow [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) to create your Apps Script backend.

### **Step 2: Import Your Old Data**

**Option A: Paste into Google Sheet**
1. Open your MonkeyMath Google Sheet
2. Go to the "Games" tab
3. Paste your data below the headers
4. Make sure columns match:
   - Column A: Timestamp (number)
   - Column B: Date (date format)
   - Column C: Difficulty
   - Column D: Duration
   - Column E: Total Problems (your score)
   - Column F: Correct (same as score - assume all correct)
   - Column G: First Try Correct (same as score)
   - Column H: Accuracy % (100 for old data)
   - Column I: QPM (calculate: score / duration * 60)
   - Column J: Avg Attempts (1.00 for old data)
   - Column K: Operators (leave blank or put "+, -, ×, ÷")
   - Column L: Raw Data (leave blank for now)

**Option B: Use Google Sheets Import**
1. In Google Sheets, go to **File → Import**
2. Upload your CSV
3. Choose **Append to current sheet**
4. Select the "Games" tab
5. Click **Import data**

### **Step 3: Verify**

1. Open MonkeyMath
2. Go to Dashboard
3. Click **⚙️ Settings**
4. Make sure your Google Sheets URL is configured
5. Your old data should now appear!

---

## 📊 Example: Converting Your Old Data

Let's say you have this old data:

```
Date: Jan 15, 2024 10:30 AM
Difficulty: Medium
Score: 30 questions
Duration: 60 seconds
```

**Convert to CSV:**
```csv
difficulty,date/time,score,duration
medium,2024-01-15 10:30,30,60
```

**Or calculate for Google Sheets:**
- Timestamp: `1705320600000` (use: `=DATEVALUE("1/15/2024 10:30")`)
- Date: `1/15/2024 10:30`
- Difficulty: `medium`
- Duration: `60`
- Total Problems: `30`
- Correct: `30`
- First Try Correct: `30`
- Accuracy %: `100`
- QPM: `30` (calculated: 30 / 60 * 60 = 30)
- Avg Attempts: `1.00`
- Operators: `+, -, ×, ÷`

---

## 🔧 Advanced: Bulk Import Script

If you have **lots of old data**, you can use this Google Sheets formula to auto-calculate:

### **In Google Sheets:**

1. Paste your basic data (difficulty, date, score, duration) in columns
2. Use formulas for calculated fields:

```
QPM formula (column I):
=E2/D2*60

Timestamp formula (column A):
=DATEVALUE(B2)*86400000

Accuracy (column H):
=100
```

3. Drag formulas down for all rows
4. Done!

---

## 🎯 Quick Reference: CSV Template

Save this as `template.csv` and fill in your data:

```csv
difficulty,date/time,score,duration
easy,2024-01-01 09:00,20,60
easy,2024-01-02 09:00,22,60
medium,2024-01-03 09:00,25,60
medium,2024-01-04 09:00,28,60
hard,2024-01-05 09:00,18,60
hard,2024-01-06 09:00,20,60
```

---

## 💡 Tips

**Date Formats That Work:**
- ✅ `2024-01-15 10:30`
- ✅ `1/15/2024 10:30 AM`
- ✅ `Jan 15, 2024 10:30`
- ✅ `2024-01-15T10:30:00`
- ✅ `1705320600000` (Unix timestamp)

**Difficulty Values:**
- ✅ `easy`, `Easy`, `EASY`
- ✅ `medium`, `Medium`, `MEDIUM`
- ✅ `hard`, `Hard`, `HARD`

**Duration:**
- Usually `60` (60 seconds = 1 minute)
- Can be any number of seconds

---

## 🐛 Troubleshooting

### **"Import failed"**
- Check CSV format matches exactly
- Make sure headers are: `difficulty,date/time,score,duration`
- No extra spaces or special characters

### **"Invalid date"**
- Use format: `YYYY-MM-DD HH:MM`
- Or just: `YYYY-MM-DD`
- Or: `M/D/YYYY`

### **Data not showing in Dashboard**
- Refresh the page
- Check browser console (F12) for errors
- Make sure data was imported (check IndexedDB in dev tools)

### **Google Sheets not syncing**
- Verify Apps Script URL is correct
- Check Google Sheet for new rows
- Look for errors in browser console

---

## 🎉 After Import

Once your data is imported:

1. **View in Dashboard** - See all your games
2. **Click any game** - View detailed results
3. **Export anytime** - Click 📤 to download CSV
4. **Analyze in Sheets** - Create charts and graphs
5. **Keep playing** - New games auto-save!

---

## 📞 Need Help?

**Common scenarios:**

**"I have data in Excel"**
→ Save as CSV, then import

**"I have data in Google Sheets already"**
→ Download as CSV, then import

**"I have data in a text file"**
→ Format as CSV, then import

**"I have hundreds of games"**
→ Use Google Sheets import method (faster)

**"I want to merge old and new data"**
→ Import old data first, then new games will append

---

## ✅ Checklist

Before importing:
- [ ] Format data as CSV
- [ ] Check headers match exactly
- [ ] Verify dates are readable
- [ ] Test with 1-2 rows first
- [ ] Then import all data

After importing:
- [ ] Check Dashboard shows correct count
- [ ] Click a game to verify details
- [ ] Export to verify data integrity
- [ ] Set up Google Sheets (optional)
- [ ] Start playing new games!

---

**Ready to import?** Just create your CSV and click the 📥 Import button in MonkeyMath! 🚀

