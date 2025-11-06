import { useState, useEffect } from 'react'
import { getSheetURL, setSheetURL, testGoogleSheetsConnection, syncToGoogleSheets } from '../utils/googleSheets'
import { getAllGameResults } from '../utils/db'
import './Settings.css'

function Settings({ onClose }) {
  const [url, setUrl] = useState('')
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState('')
  const [localGameCount, setLocalGameCount] = useState(0)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const savedUrl = getSheetURL()
    setUrl(savedUrl)
    
    const games = await getAllGameResults()
    setLocalGameCount(games.length)
  }

  const handleSave = () => {
    setSheetURL(url)
    setStatus('✅ Settings saved!')
    setTimeout(() => setStatus(''), 3000)
  }

  const handleTest = async () => {
    if (!url) {
      setStatus('❌ Please enter a URL first')
      return
    }

    setTesting(true)
    setStatus('Testing connection...')

    // Temporarily save URL for testing
    const oldUrl = getSheetURL()
    setSheetURL(url)

    try {
      const result = await testGoogleSheetsConnection()
      if (result.success) {
        setStatus('✅ Connection successful! Check your Google Sheet for a test row.')
      } else {
        setStatus(`❌ ${result.message}`)
        setSheetURL(oldUrl) // Restore old URL on failure
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`)
      setSheetURL(oldUrl)
    } finally {
      setTesting(false)
    }
  }

  const handleSync = async () => {
    if (!url) {
      setStatus('❌ Please configure Google Sheets URL first')
      return
    }

    setSyncing(true)
    setStatus('Syncing local data to Google Sheets...')

    try {
      const localGames = await getAllGameResults()
      
      if (localGames.length === 0) {
        setStatus('ℹ️ No local data to sync')
        setSyncing(false)
        return
      }

      const result = await syncToGoogleSheets(localGames)
      
      if (result.success) {
        setStatus(`✅ Synced ${result.successCount} games to Google Sheets!`)
      } else {
        setStatus(`⚠️ Synced ${result.successCount} games, ${result.errorCount} failed`)
      }
    } catch (error) {
      setStatus(`❌ Sync failed: ${error.message}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleClearUrl = () => {
    setUrl('')
    setSheetURL('')
    setStatus('✅ Google Sheets URL cleared')
  }

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="settings-section">
            <h3>📊 Google Sheets Integration</h3>
            <p className="section-description">
              Save your game data to Google Sheets for cloud storage and easy analysis.
            </p>

            <div className="form-group">
              <label htmlFor="sheets-url">Google Apps Script Web App URL</label>
              <input
                id="sheets-url"
                type="text"
                className="url-input"
                placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="input-hint">
                Don't have a URL? <a href="#" onClick={(e) => {
                  e.preventDefault()
                  window.open('GOOGLE_SHEETS_SETUP.md', '_blank')
                }}>Follow the setup guide</a>
              </p>
            </div>

            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={handleTest}
                disabled={testing || !url}
              >
                {testing ? 'Testing...' : '🧪 Test Connection'}
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!url}
              >
                💾 Save URL
              </button>
              {url && (
                <button
                  className="btn-danger"
                  onClick={handleClearUrl}
                >
                  🗑️ Clear
                </button>
              )}
            </div>
          </div>

          <div className="settings-section">
            <h3>🔄 Data Sync</h3>
            <p className="section-description">
              You have <strong>{localGameCount}</strong> games stored locally.
            </p>

            <button
              className="btn-primary full-width"
              onClick={handleSync}
              disabled={syncing || !url || localGameCount === 0}
            >
              {syncing ? 'Syncing...' : `📤 Sync ${localGameCount} Games to Google Sheets`}
            </button>

            <p className="input-hint">
              This will upload all your local game data to Google Sheets.
              Your local data will not be deleted.
            </p>
          </div>

          <div className="settings-section">
            <h3>ℹ️ How It Works</h3>
            <ul className="info-list">
              <li>✅ New games automatically save to Google Sheets</li>
              <li>✅ Data also saved locally as backup</li>
              <li>✅ Access your data from any device</li>
              <li>✅ View and analyze in Google Sheets</li>
              <li>✅ Works offline (syncs when back online)</li>
            </ul>
          </div>

          {status && (
            <div className={`status-message ${
              status.includes('✅') ? 'success' : 
              status.includes('❌') ? 'error' : 
              status.includes('⚠️') ? 'warning' : 
              'info'
            }`}>
              {status}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings

