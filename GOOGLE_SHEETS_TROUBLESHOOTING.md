# 🔧 Google Sheets Troubleshooting Guide

## Your Error: "✅ Game data saved to Google Sheets but not"

This means the request was sent but the data didn't actually save. Let's fix it!

---

## 🎯 Quick Fix Checklist

### **1. Check Your URL Format**

Your URL **MUST** end with `/exec` not `/dev` or anything else.

**❌ Wrong:**
```
https://script.googleusercontent.com/macros/echo?user_content_key=...
https://script.google.com/macros/s/ABC123.../dev
```

**✅ Correct:**
```
https://script.google.com/macros/s/AKfycbz.../exec
```

**How to get the correct URL:**
1. In Apps Script, click **Deploy** → **Manage deployments**
2. Look for the **Web App** deployment
3. Copy the URL from the **Web App** section
4. Make sure it ends with `/exec`

---

### **2. Redeploy Your Apps Script**

The most common issue is incorrect deployment settings.

**Step-by-step:**

1. **Open your Google Sheet**
2. **Extensions → Apps Script**
3. **Click Deploy → Manage deployments**
4. **Click the pencil icon ✏️** to edit the existing deployment
5. **OR click "New deployment"** if you want to start fresh
6. **Configure:**
   - Type: **Web app**
   - Description: **MonkeyMath API v2** (increment version)
   - Execute as: **Me (your-email@gmail.com)**
   - Who has access: **Anyone** ⚠️ CRITICAL!
7. **Click Deploy**
8. **Authorize if prompted:**
   - Click "Authorize access"
   - Choose your account
   - Click "Advanced"
   - Click "Go to MonkeyMath Backend (unsafe)"
   - Click "Allow"
9. **Copy the NEW Web App URL**
10. **Update in MonkeyMath Settings**

---

### **3. Verify Apps Script Code**

Make sure your Apps Script has the correct code:

**Open Apps Script and verify you have this:**

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Games');

    // Create sheet if it doesn't exist
    if (!sheet) {
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Games');
      newSheet.appendRow([
        'Timestamp', 'Date', 'Difficulty', 'Duration', 'Total Problems',
        'Correct', 'First Try Correct', 'Accuracy %', 'QPM', 'Avg Attempts',
        'Operators', 'Raw Data'
      ]);
      return doPost(e);
    }

    const data = JSON.parse(e.postData.contents);
    const qpm = ((data.totalProblems / data.duration) * 60).toFixed(1);
    const avgAttempts = data.problemHistory
      ? (data.problemHistory.reduce((sum, p) => sum + (p.attempts || 1), 0) / data.problemHistory.length).toFixed(2)
      : '1.00';

    sheet.appendRow([
      data.timestamp,
      new Date(data.timestamp),
      data.difficulty,
      data.duration,
      data.totalProblems,
      data.correctAnswers,
      data.firstTryCorrect,
      data.accuracy,
      qpm,
      avgAttempts,
      data.operators ? data.operators.join(', ') : '',
      JSON.stringify(data)
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
```

**After pasting:**
1. Click **Save** (💾)
2. **Redeploy** (see step 2 above)

---

### **4. Test the Connection**

**In MonkeyMath:**
1. Go to **Settings** (⚙️ icon)
2. Paste your Web App URL
3. Click **🧪 Test Connection**
4. Should see: "✅ Connection successful!"
5. **Check your Google Sheet** - you should see a test row

**If test fails:**
- Check the error message
- Verify URL ends with `/exec`
- Make sure deployment is set to "Anyone"
- Try redeploying

---

## 🔍 Common Issues & Solutions

### **Issue 1: "Invalid URL format"**

**Problem:** URL doesn't end with `/exec`

**Solution:**
1. Go to Apps Script
2. Deploy → Manage deployments
3. Copy the **Web App URL** (not the script URL)
4. Must end with `/exec`

---

### **Issue 2: "403 Forbidden" or "Authorization required"**

**Problem:** Deployment not set to "Anyone"

**Solution:**
1. Apps Script → Deploy → Manage deployments
2. Edit deployment (pencil icon)
3. **Who has access:** Change to **Anyone**
4. Click **Deploy**
5. Copy new URL

---

### **Issue 3: "Data not appearing in sheet"**

**Problem:** Sheet name mismatch or wrong spreadsheet

**Solution:**
1. Check your Google Sheet has a tab called **"Games"**
2. If not, create one or rename existing tab
3. Make sure you're looking at the correct Google Sheet
4. Check the Apps Script is attached to the right sheet:
   - In Apps Script, click the spreadsheet icon
   - Should open the correct sheet

---

### **Issue 4: "CORS error" or "Fetch failed"**

**Problem:** Browser blocking the request

**Solution:**
1. Make sure URL is correct
2. Try redeploying with a new version
3. Clear browser cache
4. Try in incognito mode

---

### **Issue 5: "Request sent but no data"**

**Problem:** Apps Script not processing the data

**Solution:**
1. Open Apps Script
2. Click **Executions** (left sidebar)
3. Look for recent executions
4. Check for errors
5. If you see errors, check the `doPost` function code

---

## 🧪 Manual Test

**Test your Apps Script directly:**

1. **Open Apps Script**
2. **Click the function dropdown** → Select `doPost`
3. **Click Run** (▶️)
4. **Check Execution log** for errors

**Or test via URL:**

Open this in your browser (replace YOUR_URL):
```
YOUR_WEB_APP_URL?test=true
```

Should see JSON response like:
```json
{"success":true,"data":[]}
```

---

## 📋 Deployment Checklist

Before testing, verify:

- [ ] Apps Script code is correct (both `doPost` and `doGet`)
- [ ] Saved the script (💾)
- [ ] Deployed as **Web app**
- [ ] Execute as: **Me**
- [ ] Who has access: **Anyone**
- [ ] Authorized the script
- [ ] Copied the **Web App URL** (ends with `/exec`)
- [ ] URL pasted in MonkeyMath Settings
- [ ] Google Sheet has a tab named **"Games"**
- [ ] Test connection shows success

---

## 🎯 Step-by-Step: Complete Reset

If nothing works, start fresh:

### **1. Delete Old Deployment**
1. Apps Script → Deploy → Manage deployments
2. Click archive icon 🗄️ on old deployment
3. Confirm

### **2. Create New Deployment**
1. Click **New deployment**
2. Type: **Web app**
3. Description: **MonkeyMath v1**
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy**
7. **Authorize** (follow prompts)
8. **Copy Web App URL**

### **3. Update MonkeyMath**
1. Open MonkeyMath
2. Settings → Paste new URL
3. Click **Save**
4. Click **Test Connection**

### **4. Verify**
1. Should see success message
2. Check Google Sheet for test row
3. Play a game
4. Check Google Sheet for new row

---

## 🔍 Debug Mode

**Enable detailed logging:**

Add this to the top of your `doPost` function:

```javascript
function doPost(e) {
  Logger.log('Received POST request');
  Logger.log('Post data: ' + e.postData.contents);

  try {
    // ... rest of your code
```

**Then:**
1. Play a game in MonkeyMath
2. Go to Apps Script
3. Click **Executions** (left sidebar)
4. Click the most recent execution
5. Check the logs

---

## ✅ Success Indicators

**You'll know it's working when:**

1. ✅ Test connection shows success
2. ✅ Google Sheet has a test row
3. ✅ After playing a game, new row appears
4. ✅ Console shows "✅ Game data saved to Google Sheets"
5. ✅ No errors in browser console (F12)
6. ✅ Apps Script Executions show successful runs

---

## 📞 Still Not Working?

**Check these:**

1. **Browser Console (F12)**
   - Look for red errors
   - Copy the full error message

2. **Apps Script Executions**
   - Click Executions in Apps Script
   - Look for failed executions
   - Click to see error details

3. **Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Play a game
   - Look for the request to script.google.com
   - Check the response

4. **Google Sheet**
   - Make sure you're looking at the right sheet
   - Check the "Games" tab exists
   - Look for any data

---

## 🎯 Quick Diagnostic

Run through this checklist:

```
1. URL ends with /exec?                    [ ]
2. Deployment set to "Anyone"?             [ ]
3. Script authorized?                      [ ]
4. "Games" tab exists in sheet?            [ ]
5. Test connection successful?             [ ]
6. Test row appears in sheet?              [ ]
7. No errors in browser console?           [ ]
8. No errors in Apps Script executions?    [ ]
```

If all checked ✅, it should work!

---

**Need more help?** Share:
1. The exact error message from browser console
2. Screenshot of Apps Script deployment settings
3. Screenshot of Apps Script Executions page
