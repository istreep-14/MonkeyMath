import { useState, useEffect } from 'react'
import { getAllGameResults } from '../utils/db'
import './DataExport.css'

function DataExport({ onClose }) {
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const [gameData, setGameData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const data = await getAllGameResults()
    setGameData(data)
  }

  const convertToCSV = (data) => {
    // Simple format matching import format
    const headers = ['difficulty', 'date/time', 'score', 'duration', 'accuracy', 'qpm']
    const rows = data.map(game => {
      const qpm = game.duration > 0 ? (game.totalProblems / (game.duration / 60)).toFixed(1) : 0
      return [
        game.difficulty || 'medium',
        new Date(game.timestamp).toLocaleString(),
        game.totalProblems,
        game.duration,
        game.accuracy.toFixed(1),
        qpm
      ]
    })

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    return csv
  }

  const handleDownloadCSV = () => {
    setExporting(true)
    try {
      const csv = convertToCSV(gameData)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `monkeymath-data-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setExportStatus('✅ CSV downloaded successfully!')
    } catch (error) {
      setExportStatus(`❌ Error: ${error.message}`)
    } finally {
      setExporting(false)
    }
  }

  const handleCopyCSV = () => {
    try {
      const csv = convertToCSV(gameData)
      navigator.clipboard.writeText(csv)
      setExportStatus('✅ CSV copied to clipboard! Paste into Google Sheets.')
    } catch (error) {
      setExportStatus(`❌ Error: ${error.message}`)
    }
  }

  const handleCopyGoogleSheetsFormula = () => {
    // This is a template for Google Sheets Apps Script
    const template = `
// Google Sheets Apps Script to save MonkeyMath data
// 1. Open your Google Sheet
// 2. Extensions → Apps Script
// 3. Paste this code
// 4. Save and run 'setup'
// 5. Copy the Web App URL and paste in MonkeyMath settings

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // Add headers if first row is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date/Time', 'Difficulty', 'Score', 'Duration', 'Accuracy', 'QPM', 'First Try %']);
  }
  
  // Add data
  sheet.appendRow([
    new Date(data.timestamp),
    data.difficulty,
    data.totalProblems,
    data.duration,
    data.accuracy,
    data.totalProblems / (data.duration / 60),
    (data.firstTryCorrect / data.totalProblems * 100)
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}

function setup() {
  // Run this once to authorize
  Logger.log('Setup complete!');
}
    `.trim()

    navigator.clipboard.writeText(template)
    setExportStatus('✅ Google Sheets script copied! See instructions below.')
  }

  return (
    <div className="data-export-overlay">
      <div className="data-export-modal">
        <div className="modal-header">
          <h2>Export Data</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="export-stats">
            <h3>📊 Your Data:</h3>
            <p><strong>{gameData.length}</strong> games recorded</p>
          </div>

          <div className="export-methods">
            <div className="export-method">
              <h3>📥 Download CSV File</h3>
              <p>Download your data as a CSV file to import into Excel or Google Sheets</p>
              <button
                className="btn-primary"
                onClick={handleDownloadCSV}
                disabled={exporting || gameData.length === 0}
              >
                Download CSV
              </button>
            </div>

            <div className="export-method">
              <h3>📋 Copy to Clipboard</h3>
              <p>Copy CSV data to paste directly into Google Sheets</p>
              <button
                className="btn-primary"
                onClick={handleCopyCSV}
                disabled={gameData.length === 0}
              >
                Copy CSV Data
              </button>
            </div>

            <div className="export-method">
              <h3>🔗 Google Sheets Auto-Sync (Advanced)</h3>
              <p>Set up automatic syncing to Google Sheets</p>
              <button
                className="btn-secondary"
                onClick={handleCopyGoogleSheetsFormula}
              >
                Copy Apps Script Code
              </button>
              <div className="instructions-box">
                <h4>Setup Instructions:</h4>
                <ol>
                  <li>Create a new Google Sheet</li>
                  <li>Go to <strong>Extensions → Apps Script</strong></li>
                  <li>Paste the copied code</li>
                  <li>Click <strong>Deploy → New deployment</strong></li>
                  <li>Choose <strong>Web app</strong></li>
                  <li>Set "Execute as" to <strong>Me</strong></li>
                  <li>Set "Who has access" to <strong>Anyone</strong></li>
                  <li>Click <strong>Deploy</strong> and copy the URL</li>
                  <li>Paste URL in MonkeyMath Settings (coming soon!)</li>
                </ol>
              </div>
            </div>
          </div>

          {exportStatus && (
            <div className={`export-status ${exportStatus.includes('✅') ? 'success' : exportStatus.includes('❌') ? 'error' : ''}`}>
              {exportStatus}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataExport

