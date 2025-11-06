# 🏠 Running MonkeyMath Locally - All Options

## Option 1: Desktop App (Electron) ⭐ RECOMMENDED
**One-time setup, then just double-click forever!**

See [ELECTRON_SETUP.md](ELECTRON_SETUP.md) for full instructions.

**Quick version:**
```bash
npm install --save-dev electron electron-builder
# Follow ELECTRON_SETUP.md
npm run package:mac  # or package:win or package:linux
```

**Result:** Double-click app icon to run. No terminal needed!

---

## Option 2: Shell Script / Batch File
**Click a file to auto-run npm dev**

### For Mac/Linux:

Create `start.sh`:
```bash
#!/bin/bash
cd "$(dirname "$0")"
npm install
npm run dev
```

Make it executable:
```bash
chmod +x start.sh
```

**Usage:** Double-click `start.sh` to start the dev server!

### For Windows:

Create `start.bat`:
```batch
@echo off
cd /d %~dp0
npm install
npm run dev
pause
```

**Usage:** Double-click `start.bat` to start!

---

## Option 3: Open HTML Directly (No Server)
**Build once, open forever - no npm needed!**

### Setup:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Fix paths for local file access:**
   
   Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: './'  // Add this line
   })
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

4. **Open `dist/index.html` in browser**
   - Just double-click the file!
   - Or drag it to your browser

**⚠️ Limitation:** IndexedDB might not work with `file://` protocol in some browsers. Use Chrome or Firefox.

---

## Option 4: Simple HTTP Server (No npm)
**Use Python or other simple servers**

### Python (built into Mac/Linux):

```bash
cd dist
python3 -m http.server 8000
```

Open: http://localhost:8000

### Create a script `serve.sh`:
```bash
#!/bin/bash
cd "$(dirname "$0")/dist"
python3 -m http.server 8000
```

### Or use PHP (if installed):
```bash
cd dist
php -S localhost:8000
```

---

## Option 5: Docker Container
**Run in isolated container**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  monkeymath:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

**Run:**
```bash
docker-compose up -d
```

**Access:** http://localhost:3000

**Stop:**
```bash
docker-compose down
```

---

## Option 6: Auto-Start on Boot (Mac)
**Start MonkeyMath automatically when you log in**

### Using Automator (Mac):

1. Open **Automator**
2. Create new **Application**
3. Add **Run Shell Script** action:
   ```bash
   cd /Users/YOUR_USERNAME/Desktop/monkeymath
   npm run dev
   ```
4. Save as `MonkeyMath.app`
5. Add to **Login Items**:
   - System Preferences → Users & Groups → Login Items
   - Add `MonkeyMath.app`

### Using launchd (Mac):

Create `~/Library/LaunchAgents/com.monkeymath.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.monkeymath</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npm</string>
        <string>run</string>
        <string>dev</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/YOUR_USERNAME/Desktop/monkeymath</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.monkeymath.plist
```

---

## Option 7: PWA (Progressive Web App)
**Install as app from browser**

### Setup:

1. **Install PWA plugin:**
   ```bash
   npm install vite-plugin-pwa -D
   ```

2. **Update `vite.config.js`:**
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
           background_color: '#1a1a1a',
           display: 'standalone',
           icons: [
             {
               src: '/icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: '/icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   })
   ```

3. **Deploy to Vercel/Netlify**

4. **Install from browser:**
   - Chrome: Click install icon in address bar
   - Safari: Share → Add to Home Screen

**Result:** App icon on desktop/home screen!

---

## 🎯 My Recommendations

### For You (Local Use):

**🥇 Best: Electron Desktop App**
- One-time setup
- Double-click to run
- Feels like a real app
- No terminal needed
- Works offline

**🥈 Second: Shell Script**
- Quick setup
- Double-click to start dev server
- Still need terminal open

**🥉 Third: Build + Open HTML**
- Simplest
- No server needed
- Just open the file
- IndexedDB might have issues

---

## Quick Decision Guide

**Want a real app?** → Use Electron

**Want simplest setup?** → Use shell script (`start.sh`)

**Want no dependencies?** → Build once, open HTML file

**Want to share with others?** → Deploy to Vercel

**Want it on your phone?** → Deploy + PWA

---

## 🚀 My Suggestion for You

Since you said "don't mind running local" and "don't worry about npm":

### **Use the Shell Script Method:**

1. **Create `start.command` (Mac):**
   ```bash
   #!/bin/bash
   cd "$(dirname "$0")"
   npm install
   npm run dev
   open http://localhost:5173
   ```

2. **Make executable:**
   ```bash
   chmod +x start.command
   ```

3. **Double-click `start.command`** whenever you want to use MonkeyMath!

**That's it!** No need to remember npm commands. Just double-click and it opens in your browser automatically.

---

Want me to set up any of these options for you? 🎯

