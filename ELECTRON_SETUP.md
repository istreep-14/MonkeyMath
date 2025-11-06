# 🖥️ Convert MonkeyMath to Desktop App (Electron)

## Quick Setup - Make it a Double-Click App!

### Step 1: Install Electron Dependencies

```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

### Step 2: Update package.json

Add these scripts to your `package.json`:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron": "wait-on http://localhost:5173 && electron .",
    "electron:dev": "concurrently \"npm run dev\" \"npm run electron\"",
    "electron:build": "npm run build && electron-builder",
    "package:mac": "npm run build && electron-builder --mac",
    "package:win": "npm run build && electron-builder --win",
    "package:linux": "npm run build && electron-builder --linux"
  },
  "build": {
    "appId": "com.monkeymath.app",
    "productName": "MonkeyMath",
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "directories": {
      "buildResources": "assets"
    },
    "mac": {
      "category": "public.app-category.education",
      "icon": "assets/icon.icns"
    },
    "win": {
      "icon": "assets/icon.ico"
    },
    "linux": {
      "icon": "assets/icon.png",
      "category": "Education"
    }
  }
}
```

### Step 3: Create Electron Main File

Create `electron/main.js`:

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'MonkeyMath',
    backgroundColor: '#1a1a1a'
  })

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    // In production, load from built files
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

### Step 4: Build the App

```bash
# For Mac
npm run package:mac

# For Windows
npm run package:win

# For Linux
npm run package:linux
```

### Step 5: Install and Use

After building:
- **Mac**: Find `MonkeyMath.app` in `dist/` folder → Drag to Applications
- **Windows**: Find `MonkeyMath.exe` in `dist/` folder → Double-click to run
- **Linux**: Find `MonkeyMath.AppImage` in `dist/` folder → Make executable and run

**Now you can just double-click the app icon to run MonkeyMath!** 🎉

---

## Development Mode

While developing, run:
```bash
npm run electron:dev
```

This opens the app in a window with hot-reload!

---

## Icon Setup (Optional)

1. Create icons in `assets/` folder:
   - `icon.icns` for Mac (512x512 PNG → convert online)
   - `icon.ico` for Windows (256x256 PNG → convert online)
   - `icon.png` for Linux (512x512 PNG)

2. Use online converters:
   - https://cloudconvert.com/png-to-icns
   - https://cloudconvert.com/png-to-ico

---

## Auto-Updates (Advanced)

Add auto-update capability:

```bash
npm install electron-updater
```

Update `electron/main.js`:
```javascript
const { autoUpdater } = require('electron-updater')

app.whenReady().then(() => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
})
```

---

## File Size

Built app size:
- **Mac**: ~150MB
- **Windows**: ~120MB
- **Linux**: ~130MB

(Includes Chromium browser engine)

