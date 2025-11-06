import { useState } from 'react'
import { saveGameResult } from '../utils/db'
import './DataImport.css'

function DataImport({ onClose, onImportComplete }) {
  const [importing, setImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [csvData, setCsvData] = useState('')

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setCsvData(event.target.result)
    }
    reader.readAsText(file)
  }

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim()
      })
      data.push(row)
    }
    return data
  }

  const convertOldDataToNewFormat = (oldData) => {
    // Expected old format: difficulty, date/time, score(questions), duration
    // Convert to new format
    
    const difficulty = oldData.difficulty || 'medium'
    const dateStr = oldData['date/time'] || oldData.date || oldData.datetime
    const score = parseInt(oldData.score || oldData.questions || 0)
    const duration = parseInt(oldData.duration || 60)
    
    // Parse date
    let timestamp
    try {
      timestamp = new Date(dateStr).getTime()
      if (isNaN(timestamp)) {
        timestamp = Date.now()
      }
    } catch {
      timestamp = Date.now()
    }

    // Create mock problem history (since we don't have detailed data)
    const problemHistory = []
    const avgTimePerQuestion = (duration / score) * 1000 // in ms
    
    for (let i = 0; i < score; i++) {
      problemHistory.push({
        display: '? + ? = ?', // Unknown
        answer: 0,
        userAnswer: 0,
        correct: true,
        firstTryCorrect: true,
        timeTaken: avgTimePerQuestion,
        timestamp: timestamp + (i * avgTimePerQuestion),
        attempts: 1,
        keystrokes: 2,
        backspaces: 0,
        hadMistake: false
      })
    }

    return {
      totalProblems: score,
      correctAnswers: score,
      firstTryCorrect: score,
      eventuallyCorrect: score,
      accuracy: 100, // Assuming all correct since we only have score
      duration: duration,
      problemHistory: problemHistory,
      config: {
        duration: duration,
        difficulty: difficulty,
        operators: ['+', '-', '×', '÷']
      },
      timestamp: timestamp,
      date: new Date(timestamp).toISOString(),
      difficulty: difficulty,
      operators: ['+', '-', '×', '÷'],
      imported: true // Mark as imported data
    }
  }

  const handleImport = async () => {
    if (!csvData) {
      setImportStatus('Please upload a CSV file first')
      return
    }

    setImporting(true)
    setImportStatus('Importing...')

    try {
      const parsedData = parseCSV(csvData)
      let successCount = 0
      let errorCount = 0

      for (const row of parsedData) {
        try {
          const convertedData = convertOldDataToNewFormat(row)
          await saveGameResult(convertedData)
          successCount++
        } catch (error) {
          console.error('Error importing row:', row, error)
          errorCount++
        }
      }

      setImportStatus(`✅ Import complete! ${successCount} records imported, ${errorCount} errors`)
      
      setTimeout(() => {
        if (onImportComplete) onImportComplete()
      }, 2000)
    } catch (error) {
      setImportStatus(`❌ Error: ${error.message}`)
    } finally {
      setImporting(false)
    }
  }

  const handlePasteData = (e) => {
    setCsvData(e.target.value)
  }

  return (
    <div className="data-import-overlay">
      <div className="data-import-modal">
        <div className="modal-header">
          <h2>Import Old Data</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="import-instructions">
            <h3>📊 Expected CSV Format:</h3>
            <pre className="csv-example">
difficulty,date/time,score,duration
easy,2024-01-15 10:30,25,60
medium,2024-01-16 14:20,30,60
hard,2024-01-17 09:15,20,60
            </pre>
            <p><strong>Required columns:</strong></p>
            <ul>
              <li><code>difficulty</code> - easy, medium, or hard</li>
              <li><code>date/time</code> - Any date format (e.g., 2024-01-15 or 1/15/2024)</li>
              <li><code>score</code> - Number of questions answered</li>
              <li><code>duration</code> - Test duration in seconds</li>
            </ul>
          </div>

          <div className="import-methods">
            <div className="import-method">
              <h3>Method 1: Upload CSV File</h3>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="file-input"
              />
            </div>

            <div className="import-method">
              <h3>Method 2: Paste CSV Data</h3>
              <textarea
                className="csv-textarea"
                placeholder="Paste your CSV data here..."
                value={csvData}
                onChange={handlePasteData}
                rows={10}
              />
            </div>
          </div>

          {csvData && (
            <div className="preview-section">
              <h3>Preview:</h3>
              <div className="preview-data">
                {parseCSV(csvData).slice(0, 3).map((row, i) => (
                  <div key={i} className="preview-row">
                    {Object.entries(row).map(([key, value]) => (
                      <span key={key}>
                        <strong>{key}:</strong> {value}
                      </span>
                    ))}
                  </div>
                ))}
                {parseCSV(csvData).length > 3 && (
                  <p className="preview-more">
                    ... and {parseCSV(csvData).length - 3} more records
                  </p>
                )}
              </div>
            </div>
          )}

          {importStatus && (
            <div className={`import-status ${importStatus.includes('✅') ? 'success' : importStatus.includes('❌') ? 'error' : ''}`}>
              {importStatus}
            </div>
          )}

          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={onClose}
              disabled={importing}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleImport}
              disabled={!csvData || importing}
            >
              {importing ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataImport

