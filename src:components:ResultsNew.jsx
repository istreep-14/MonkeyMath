import { useEffect, useRef, useState } from 'react'
import { calculateQPM, getTimeClass, getTimeClassConfig, formatDuration } from '../utils/timeClass'

function Results({ results, onRestart, onDashboard }) {
  const canvasRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const chartDataRef = useRef(null)

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
      drawChart()
    }
  }, [results])

  const calculateBurstScore = (history, index) => {
    // Calculate 3-question average centered on current question
    const start = Math.max(0, index - 1)
    const end = Math.min(history.length, index + 2)
    const window = history.slice(start, end)

    const totalTime = window.reduce((sum, p) => sum + (p.timeTaken / 1000), 0)
    const avgTime = totalTime / window.length

    return avgTime > 0 ? Math.round(60 / avgTime) : 0
  }

  const calculateCumulativeScore = (history, upToIndex) => {
    // Calculate QPM for all questions up to this point
    const totalTime = history.slice(0, upToIndex + 1).reduce((sum, p) => sum + (p.timeTaken / 1000), 0)
    const questionsAnswered = upToIndex + 1

    return totalTime > 0 ? Math.round((questionsAnswered / totalTime) * 60) : 0
  }

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 60, bottom: 50, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    ctx.clearRect(0, 0, width, height)

    const history = results.problemHistory
    const pointsData = []

    // Calculate data for each question
    const timesPerQuestion = []
    const cumulativeScores = []
    const burstScores = []

    for (let i = 0; i < history.length; i++) {
      timesPerQuestion.push(history[i].timeTaken / 1000)
      cumulativeScores.push(calculateCumulativeScore(history, i))
      burstScores.push(calculateBurstScore(history, i))
    }

    // Calculate average time for dashed line
    const avgTime = timesPerQuestion.reduce((a, b) => a + b, 0) / timesPerQuestion.length

    // Find max values for scaling
    const maxTime = Math.max(...timesPerQuestion, avgTime) * 1.2
    const maxScore = Math.max(...cumulativeScores, ...burstScores, 60)

    // Draw grid
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 1
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Left Y-axis labels (Time in seconds)
      const timeValue = maxTime - (maxTime / gridLines) * i
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(timeValue.toFixed(1) + 's', padding.left - 10, y + 4)

      // Right Y-axis labels (Score/QPM)
      const scoreValue = maxScore - (maxScore / gridLines) * i
      ctx.textAlign = 'left'
      ctx.fillText(Math.round(scoreValue), width - padding.right + 10, y + 4)
    }

    // Calculate bar width
    const barWidth = Math.min(30, chartWidth / history.length * 0.6)
    const spacing = chartWidth / history.length

    // Draw bars for time per question
    for (let i = 0; i < history.length; i++) {
      const x = padding.left + spacing * i + (spacing - barWidth) / 2
      const barHeight = (timesPerQuestion[i] / maxTime) * chartHeight
      const y = padding.top + chartHeight - barHeight

      // Bar color - lighter if hovered
      ctx.fillStyle = hoveredPoint === i ? '#4b5563' : '#374151'
      ctx.fillRect(x, y, barWidth, barHeight)

      // Error indicator on bar
      if (history[i].attempts > 1) {
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(x, y, barWidth, 3)
      }
    }

    // Draw average time dashed line
    const avgY = padding.top + chartHeight - (avgTime / maxTime) * chartHeight
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding.left, avgY)
    ctx.lineTo(width - padding.right, avgY)
    ctx.stroke()
    ctx.setLineDash([])

    // Label for average line
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Avg: ${avgTime.toFixed(1)}s`, width - padding.right + 10, avgY + 4)

    // Draw cumulative score line
    ctx.beginPath()
    for (let i = 0; i < history.length; i++) {
      const x = padding.left + spacing * i + spacing / 2
      const y = padding.top + chartHeight - (cumulativeScores[i] / maxScore) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      pointsData.push({
        x,
        y,
        index: i,
        score: cumulativeScores[i],
        burstScore: burstScores[i],
        time: timesPerQuestion[i],
        problem: history[i]
      })
    }
    ctx.strokeStyle = '#f5c30f'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw burst score line
    ctx.beginPath()
    for (let i = 0; i < history.length; i++) {
      const x = padding.left + spacing * i + spacing / 2
      const y = padding.top + chartHeight - (burstScores[i] / maxScore) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points on lines
    for (let i = 0; i < pointsData.length; i++) {
      const point = pointsData[i]

      // Cumulative score point
      ctx.beginPath()
      ctx.arc(point.x, point.y, hoveredPoint === i ? 5 : 3, 0, Math.PI * 2)
      ctx.fillStyle = hoveredPoint === i ? '#f5c30f' : '#f5c30f'
      ctx.fill()

      // Burst score point
      const burstY = padding.top + chartHeight - (burstScores[i] / maxScore) * chartHeight
      ctx.beginPath()
      ctx.arc(point.x, burstY, hoveredPoint === i ? 4 : 2, 0, Math.PI * 2)
      ctx.fillStyle = hoveredPoint === i ? '#10b981' : '#10b981'
      ctx.fill()
    }

    // X-axis labels (question numbers)
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    const labelInterval = Math.max(1, Math.floor(history.length / 10))
    for (let i = 0; i < history.length; i += labelInterval) {
      const x = padding.left + spacing * i + spacing / 2
      ctx.fillText(i + 1, x, height - padding.bottom + 20)
    }

    // X-axis title
    ctx.font = '12px Inter, sans-serif'
    ctx.fillText('Question Number', width / 2, height - 10)

    // Left Y-axis label (Time)
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText('Time (seconds)', 0, 0)
    ctx.restore()

    // Right Y-axis label (Score)
    ctx.save()
    ctx.translate(width - 15, height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText('Score (QPM)', 0, 0)
    ctx.restore()

    // Legend
    const legendX = padding.left
    const legendY = padding.top - 25

    // Bars legend
    ctx.fillStyle = '#374151'
    ctx.fillRect(legendX, legendY, 15, 10)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Time per question', legendX + 20, legendY + 9)

    // Cumulative score legend
    ctx.strokeStyle = '#f5c30f'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(legendX + 150, legendY + 5)
    ctx.lineTo(legendX + 165, legendY + 5)
    ctx.stroke()
    ctx.fillStyle = '#f5c30f'
    ctx.fillText('Cumulative Score', legendX + 170, legendY + 9)

    // Burst score legend
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(legendX + 310, legendY + 5)
    ctx.lineTo(legendX + 325, legendY + 5)
    ctx.stroke()
    ctx.fillStyle = '#10b981'
    ctx.fillText('Burst Score (3Q avg)', legendX + 330, legendY + 9)

    chartDataRef.current = { pointsData, padding, width, height, spacing, barWidth }
  }

  const handleMouseMove = (e) => {
    if (!chartDataRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const { pointsData } = chartDataRef.current
    let closestPoint = null
    let minDist = Infinity

    for (let i = 0; i < pointsData.length; i++) {
      const point = pointsData[i]
      const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
      if (dist < 20 && dist < minDist) {
        minDist = dist
        closestPoint = i
      }
    }

    if (closestPoint !== null) {
      setHoveredPoint(closestPoint)
      const point = pointsData[closestPoint]
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        data: {
          question: point.index + 1,
          score: point.score,
          burstScore: point.burstScore,
          time: point.time.toFixed(2),
          attempts: point.problem.attempts,
          problem: point.problem.display
        }
      })
      drawChart()
    } else {
      if (hoveredPoint !== null) {
        setHoveredPoint(null)
        setTooltip(null)
        drawChart()
      }
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
    setTooltip(null)
    drawChart()
  }

  const timeClass = getTimeClass(results.duration)
  const timeClassConfig = getTimeClassConfig(results.duration)
  const overallQPM = calculateQPM(results.totalProblems, results.duration)

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Test Results</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className={`badge badge-${timeClass}`}>{timeClassConfig.name.toUpperCase()}</span>
          <span className="text-gray-400">{formatDuration(results.duration)}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 capitalize">{results.difficulty || results.config?.difficulty}</span>
        </div>
      </div>

      {/* Main Score */}
      <div className="card mb-6 text-center">
        <div className="text-sm text-gray-400 mb-2">Final Score</div>
        <div className="text-6xl font-bold text-primary-500 mb-2">{overallQPM}</div>
        <div className="text-sm text-gray-400">{results.totalProblems} questions answered</div>
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Performance Analysis</h2>
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-96 cursor-crosshair"
          />
          {tooltip && (
            <div
              className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs pointer-events-none shadow-xl"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 100,
              }}
            >
              <div className="font-semibold text-primary-400 mb-1">Question #{tooltip.data.question}</div>
              <div className="text-gray-300 mb-2">{tooltip.data.problem}</div>
              <div className="space-y-0.5">
                <div className="text-gray-400">Time: <span className="text-gray-200 font-semibold">{tooltip.data.time}s</span></div>
                <div className="text-gray-400">Cumulative Score: <span className="text-primary-400 font-bold">{tooltip.data.score}</span></div>
                <div className="text-gray-400">Burst Score: <span className="text-green-400 font-bold">{tooltip.data.burstScore}</span></div>
                <div className="text-gray-400">Attempts: <span className={tooltip.data.attempts > 1 ? 'text-red-400' : 'text-green-400'}>{tooltip.data.attempts}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRestart} className="flex-1 btn-primary">
          New Test (Space)
        </button>
        <button onClick={onDashboard} className="flex-1 btn-secondary">
          Dashboard
        </button>
      </div>
    </div>
  )
}

export default Results

