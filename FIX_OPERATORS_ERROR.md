# 🔧 Fix: "data.operators.join is not a function"

## The Problem

Your Google Apps Script is trying to call `.join()` on `data.operators`, but it's not an array.

## ✅ Quick Fix (2 Minutes)

### **Step 1: Update Your Apps Script Code**

1. **Open your Google Sheet**
2. **Extensions → Apps Script**
3. **Find this section** (around line 59-81):

```javascript
// OLD CODE (has the bug):
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
  data.operators ? data.operators.join(', ') : '',  // ❌ THIS LINE CAUSES THE ERROR
  JSON.stringify(data)
]);
```

4. **Replace with this NEW CODE:**

```javascript
// NEW CODE (fixed):
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
  operatorsStr,  // ✅ NOW HANDLES ALL CASES
  JSON.stringify(data)
]);
```

5. **Click Save** (💾 icon)

---

### **Step 2: Redeploy**

1. **Click Deploy → Manage deployments**
2. **Click the pencil icon ✏️** to edit
3. **Change version** (or just click Deploy)
4. **Click Deploy**
5. **Done!**

---

### **Step 3: Test**

1. **Open MonkeyMath**
2. **Play a quick game** (even just 10 seconds)
3. **Check your Google Sheet** - new row should appear!
4. **Check browser console** - should see "✅ Game data saved to Google Sheets"

---

## 📋 Complete Fixed Apps Script

If you want to replace the entire `doPost` function, here it is:

```javascript
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
```

---

## ✅ What This Fixes

**Before:** Script assumed `data.operators` was always an array  
**After:** Script handles:
- ✅ Array: `['+', '-', '×', '÷']`
- ✅ Object: `{0: '+', 1: '-'}`
- ✅ String: `'+'`
- ✅ Undefined: Falls back to `data.config.operators`
- ✅ Missing: Uses empty string

---

## 🎯 After the Fix

**You should see:**
1. ✅ No more errors in browser console
2. ✅ "✅ Game data saved to Google Sheets" message
3. ✅ New rows appearing in your Google Sheet
4. ✅ Operators column showing: `+, -, ×, ÷`

---

## 🐛 Still Not Working?

**Check:**
1. Did you click **Save** (💾) in Apps Script?
2. Did you **Redeploy** after saving?
3. Is the URL in MonkeyMath Settings correct?
4. Try **Test Connection** in Settings

**If still failing:**
- Open Apps Script → **Executions** (left sidebar)
- Look for the most recent execution
- Click it to see the error details
- Share the error message

---

**That's it! Your Google Sheets integration should now work perfectly! 🎉**

