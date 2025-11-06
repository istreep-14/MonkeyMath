# 📊 Google Sheets Backend Setup for MonkeyMath

## Why Google Sheets + Apps Script?

**Perfect for MonkeyMath because:**
- ✅ **Free unlimited storage** - No database costs
- ✅ **Access from anywhere** - Data syncs across all devices
- ✅ **Easy to view/analyze** - Your data in a spreadsheet
- ✅ **No server needed** - Google handles everything
- ✅ **Works with Vercel/local** - Just an API endpoint
- ✅ **Can add auth later** - Google login integration

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Create Google Sheet**

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new sheet called **"MonkeyMath Data"**
3. Keep it open - we'll use it in Step 2

---

### **Step 2: Create Apps Script**

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete the default code
3. **Paste this code:**

```javascript
// MonkeyMath Backend - Google Apps Script
// This handles saving and retrieving game data

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Games');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Games');
      newSheet.appendRow([
        'Timestamp',
        'Date',
        'Difficulty', 
        'Duration',
        'Total Problems',
        'Correct',
        'First Try Correct',
        'Accuracy %',
        'QPM',
        'Avg Attempts',
        'Operators',
        'Raw Data'
      ]);
      return doPost(e); // Retry after creating sheet
    }
    
    const data = JSON.parse(e.postData.contents);

    // Calculate metrics
    const qpm = ((data.totalProblems / data.duration) * 60).toFixed(1);
    const avgAttempts = data.problemHistory
      ? (data.problemHistory.reduce((sum, p) => sum + (p.attempts || 1), 0) / data.problemHistory.length).toFixed(2)
      : '1.00';

    // Handle operators - could be array, object, or undefined
    let operatorsStr = '';
    if (data.operators) {
      if (Array.isArray(data.operators)) {
        operatorsStr = data.operators.join(', ');
      } else if (typeof data.operators === 'object') {
        operatorsStr = Object.values(data.operators).join(', ');
      } else {
        operatorsStr = String(data.operators);
      }
    } else if (data.config && data.config.operators) {
      if (Array.isArray(data.config.operators)) {
        operatorsStr = data.config.operators.join(', ');
      } else {
        operatorsStr = String(data.config.operators);
      }
    }

    // Add row to sheet
    sheet.appendRow([
      data.timestamp,
      new Date(data.timestamp),
      data.difficulty || (data.config ? data.config.difficulty : 'unknown'),
      data.duration,
      data.totalProblems,
      data.correctAnswers,
      data.firstTryCorrect,
      data.accuracy,
      qpm,
      avgAttempts,
      operatorsStr,
      JSON.stringify(data) // Store full data for later retrieval
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Games');
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rawDataIndex = headers.indexOf('Raw Data');
    
    // Get all game data (skip header row)
    const games = [];
    for (let i = 1; i < data.length; i++) {
      try {
        const rawData = data[i][rawDataIndex];
        if (rawData) {
          games.push(JSON.parse(rawData));
        }
      } catch (err) {
        console.error('Error parsing row', i, err);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: games }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this once to authorize
function test() {
  Logger.log('Apps Script is working!');
}
```

4. Click **Save** (💾 icon)
5. Name it: **"MonkeyMath Backend"**

---

### **Step 3: Deploy as Web App**

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** "MonkeyMath API"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to MonkeyMath Backend (unsafe)**
9. Click **Allow**
10. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

---

### **Step 4: Add URL to MonkeyMath**

1. Open MonkeyMath
2. Go to **Dashboard**
3. Click **Settings** (gear icon)
4. Paste your Web App URL
5. Click **Save**

**Done!** Your data now saves to Google Sheets automatically! 🎉

---

## 📊 What You Get

### **In Google Sheets:**
- Every game appears as a new row
- Easy to view, sort, filter
- Create charts and graphs
- Export to Excel anytime
- Share with others

### **In MonkeyMath:**
- Data syncs across devices
- Works on phone, tablet, computer
- Never lose your progress
- Can still work offline (saves when back online)

---

## 🔧 Advanced Features

### **Import Old Data**

If you have old data in CSV format:

1. Open your Google Sheet
2. Go to **File → Import**
3. Upload your CSV
4. Choose **Append to current sheet**
5. Click **Import data**

### **Add Multiple Users**

Want to track multiple people's data?

1. Add a "User" column to your sheet
2. Update the Apps Script to include a user parameter
3. Each person gets their own rows

### **Create Dashboard in Sheets**

1. Create a new sheet tab called "Dashboard"
2. Use formulas to calculate:
   - Total games: `=COUNTA(Games!A:A)-1`
   - Average accuracy: `=AVERAGE(Games!H:H)`
   - Best QPM: `=MAX(Games!I:I)`
3. Create charts from your data

---

## 🐛 Troubleshooting

### **"Authorization required"**
- Run the `test()` function in Apps Script
- Click **Review permissions** and authorize

### **"Script not found"**
- Make sure you deployed as Web App
- Check the URL is correct
- Try creating a new deployment

### **Data not saving**
- Check browser console for errors
- Make sure URL ends with `/exec` not `/dev`
- Verify the sheet name is "Games"

### **CORS errors**
- This is normal - Apps Script handles CORS automatically
- Make sure "Who has access" is set to "Anyone"

---

## 🔒 Security Notes

**Is my data safe?**
- ✅ Data is in your Google account
- ✅ Only you can see the spreadsheet
- ✅ Apps Script runs under your permissions
- ⚠️ Anyone with the URL can POST data (but can't read it)

**To make it more secure:**
1. Add a secret key parameter
2. Check the key in `doPost()`
3. Only save if key matches

Example:
```javascript
function doPost(e) {
  const SECRET_KEY = 'your-secret-key-here';
  const data = JSON.parse(e.postData.contents);
  
  if (data.apiKey !== SECRET_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: 'Invalid API key' 
    }));
  }
  
  // ... rest of code
}
```

---

## 📈 Next Steps

After setup:
- [ ] Test by playing a game
- [ ] Check Google Sheet for new row
- [ ] Import old data (if you have any)
- [ ] Create charts in Google Sheets
- [ ] Share your progress!

---

## 💡 Pro Tips

**Backup your data:**
```
File → Download → CSV
```

**View data in MonkeyMath:**
- Dashboard shows recent games
- Click any game to see details

**Analyze in Sheets:**
- Create pivot tables
- Make charts
- Calculate trends
- Compare difficulty levels

**Share with friends:**
- Give them the Web App URL
- They can save to the same sheet
- Add a "Name" field to track who's who

---

## 🎯 Why This is Better Than IndexedDB

| Feature | IndexedDB | Google Sheets |
|---------|-----------|---------------|
| **Storage** | ~50MB limit | Unlimited |
| **Sync** | ❌ Local only | ✅ Cloud sync |
| **Access** | ❌ One device | ✅ All devices |
| **Backup** | ❌ Manual | ✅ Automatic |
| **View data** | ❌ Hard | ✅ Easy (spreadsheet) |
| **Share** | ❌ Can't | ✅ Easy |
| **Analyze** | ❌ Hard | ✅ Built-in charts |
| **Export** | ❌ Manual | ✅ One click |

---

**Ready to set it up?** Follow the steps above and you'll have cloud storage in 5 minutes! 🚀

