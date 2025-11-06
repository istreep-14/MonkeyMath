import { useEffect, useRef } from 'react'
import './Results.css'

function Results({ results, onRestart, onDashboard }) {
  const qpmChartRef = useRef(null)
  const attemptsChartRef = useRef(null)

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        onRestart()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onRestart])

  useEffect(() => {
    if (results && results.problemHistory.length > 0) {
      drawQPMChart()
      drawAttemptsChart()
    }
  }, [results])

  // Smooth data using moving average
  const smoothData = (data, windowSize = 3) => {
    if (data.length < windowSize) return data
    const smoothed = []
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2))
      const end = Math.min(data.length, i + Math.ceil(windowSize / 2))
      const window = data.slice(start, end)
      const avg = window.reduce((a, b) => a + b, 0) / window.length
      smoothed.push(avg)
    }
    return smoothed
  }

  const drawQPMChart = () => {
    const canvas = qpmChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const padding = 60
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    ctx.clearRect(0, 0, width, height)

    const history = results.problemHistory
    const questionData = []
    const instantQPMData = []
    const errorsData = []

    // Calculate instantaneous QPM for each question (60 / time_for_that_question)
    for (let i = 0; i < history.length; i++) {
      const timeTaken = history[i].timeTaken / 1000 // in seconds
      const instantQPM = timeTaken > 0 ? 60 / timeTaken : 0

      questionData.push(i + 1)
      instantQPMData.push(instantQPM)
      errorsData.push(history[i].attempts > 1)
    }

    // Smooth the QPM data for better visualization
    const smoothedQPM = smoothData(instantQPMData, 5)

    const maxQPM = Math.max(...smoothedQPM, 60)
    const minQPM = 0

    // Draw background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 1
    const gridLines = 6
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      const qpmValue = maxQPM - (maxQPM / gridLines) * i
      ctx.fillStyle = '#666'
      ctx.font = '11px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(qpmValue.toFixed(0), padding - 10, y + 4)
    }

    // Draw vertical grid lines
    const verticalLines = Math.min(10, history.length)
    for (let i = 0; i <= verticalLines; i++) {
      const x = padding + (chartWidth / verticalLines) * i
      ctx.strokeStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()

      // X-axis labels (question numbers)
      const questionNum = Math.round((history.length / verticalLines) * i)
      if (questionNum > 0) {
        ctx.fillStyle = '#666'
        ctx.font = '11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`Q${questionNum}`, x, height - padding + 20)
      }
    }

    // Draw smoothed QPM line with gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, '#60a5fa')
    gradient.addColorStop(1, '#3b82f6')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    for (let i = 0; i < smoothedQPM.length; i++) {
      const x = padding + (i / (smoothedQPM.length - 1)) * chartWidth
      const normalizedQPM = (smoothedQPM[i] - minQPM) / (maxQPM - minQPM)
      const y = padding + chartHeight - normalizedQPM * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw area under the curve
    ctx.lineTo(width - padding, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    const areaGradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    areaGradient.addColorStop(0, 'rgba(96, 165, 250, 0.2)')
    areaGradient.addColorStop(1, 'rgba(96, 165, 250, 0.05)')
    ctx.fillStyle = areaGradient
    ctx.fill()

    // Draw error markers (X marks for multi-try questions)
    for (let i = 0; i < errorsData.length; i++) {
      if (errorsData[i]) {
        const x = padding + (i / (smoothedQPM.length - 1)) * chartWidth
        const normalizedQPM = (smoothedQPM[i] - minQPM) / (maxQPM - minQPM)
        const y = padding + chartHeight - normalizedQPM * chartHeight

        // Draw X marker
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        const size = 8

        ctx.beginPath()
        ctx.moveTo(x - size, y - size)
        ctx.lineTo(x + size, y + size)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + size, y - size)
        ctx.lineTo(x - size, y + size)
        ctx.stroke()
      }
    }

    // Draw axis labels
    ctx.fillStyle = '#888'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Questions Per Minute (QPM)', width / 2, 25)

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('QPM', 0, 0)
    ctx.restore()

    ctx.fillText('Question Number', width / 2, height - 10)
  }

  const drawAttemptsChart = () => {
    const canvas = attemptsChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    ctx.clearRect(0, 0, width, height)

    const history = results.problemHistory
    const attemptsData = history.map(p => p.attempts || 1)
    const maxAttempts = Math.max(...attemptsData, 3)

    // Draw grid
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 1
    for (let i = 0; i <= maxAttempts; i++) {
      const y = padding + (chartHeight / maxAttempts) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw bars
    const barWidth = Math.max(2, chartWidth / attemptsData.length - 2)
    for (let i = 0; i < attemptsData.length; i++) {
      const x = padding + (chartWidth / attemptsData.length) * i
      const normalizedAttempts = attemptsData[i] / maxAttempts
      const barHeight = normalizedAttempts * chartHeight
      const y = height - padding - barHeight

      if (attemptsData[i] === 1) {
        ctx.fillStyle = '#4ade80'
      } else if (attemptsData[i] === 2) {
        ctx.fillStyle = '#fbbf24'
      } else {
        ctx.fillStyle = '#f87171'
      }

      ctx.fillRect(x, y, barWidth, barHeight)
    }

    // Draw labels
    ctx.fillStyle = '#888'
    ctx.font = '12px monospace'
    ctx.fillText(`${maxAttempts}`, 5, padding + 5)
    ctx.fillText('1', 5, height - padding + 5)
  }

  if (!results) return null

  const avgTime = results.problemHistory.length > 0
    ? (results.problemHistory.reduce((sum, p) => sum + p.timeTaken, 0) / results.problemHistory.length / 1000).toFixed(2)
    : 0

  const qpm = results.totalProblems > 0
    ? ((results.totalProblems / results.duration) * 60).toFixed(1)
    : 0
  
  const totalKeystrokes = results.problemHistory.reduce((sum, p) => sum + (p.keystrokes || 0), 0)
  const totalBackspaces = results.problemHistory.reduce((sum, p) => sum + (p.backspaces || 0), 0)
  const avgAttempts = results.problemHistory.length > 0
    ? (results.problemHistory.reduce((sum, p) => sum + (p.attempts || 1), 0) / results.problemHistory.length).toFixed(1)
    : 0

  return (
    <div className="results">
      <div className="results-container">
        <h1 className="results-title">Test Complete!</h1>
        
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-value">{qpm}</div>
            <div className="stat-label">QPM</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value highlight">{results.accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{avgTime}s</div>
            <div className="stat-label">Avg Time</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{avgAttempts}</div>
            <div className="stat-label">Avg Attempts</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{totalKeystrokes}</div>
            <div className="stat-label">Keystrokes</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{totalBackspaces}</div>
            <div className="stat-label">Backspaces</div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container full-width">
            <h3 className="chart-title">Performance Analysis - Questions Per Minute</h3>
            <canvas ref={qpmChartRef} width="1200" height="400"></canvas>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{background: '#60a5fa'}}></span>
                Smoothed QPM
              </span>
              <span className="legend-item">
                <span className="legend-x">✕</span>
                Errors (Multi-try)
              </span>
            </div>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Attempts per Problem</h3>
            <canvas ref={attemptsChartRef} width="600" height="200"></canvas>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{background: '#4ade80'}}></span>
                First Try
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{background: '#fbbf24'}}></span>
                2 Attempts
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{background: '#f87171'}}></span>
                3+ Attempts
              </span>
            </div>
          </div>
        </div>

        <div className="problem-history">
          <h2 className="history-title">Problem History ({results.problemHistory.length} questions)</h2>
          <div className="history-grid">
            {results.problemHistory.map((problem, index) => (
              <div
                key={index}
                className={`history-card ${problem.firstTryCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="card-header">
                  <span className="problem-number">Q{index + 1}</span>
                  <span className="status-icon">
                    {problem.firstTryCorrect ? '✓' : problem.correct ? '○' : '✗'}
                  </span>
                </div>

                <div className="problem-text">{problem.display}</div>

                <div className="answer-row">
                  <span className="user-answer">{problem.userAnswer}</span>
                  {!problem.correct && (
                    <span className="correct-answer">({problem.answer})</span>
                  )}
                </div>

                <div className="card-stats">
                  <span className="attempt-count">
                    {problem.firstTryCorrect ? '✓ Clean' :
                     problem.hadMistake ? '✗ Corrected' :
                     problem.attempts === 1 ? '1st try' : `${problem.attempts} tries`}
                  </span>
                  <span className="keystroke-info">
                    {problem.keystrokes}k
                    {problem.backspaces > 0 && ` / ${problem.backspaces}⌫`}
                  </span>
                  <span className="time-taken">
                    {(problem.timeTaken / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button className="action-button active" onClick={onRestart}>
            New Test
          </button>
          <button className="action-button" onClick={onDashboard}>
            Dashboard
          </button>
        </div>
        
        <p className="hint">Press <kbd>Space</kbd> for new test</p>
      </div>
    </div>
  )
}

export default Results