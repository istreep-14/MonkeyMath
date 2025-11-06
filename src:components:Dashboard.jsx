import { useState, useEffect } from 'react'
import './Dashboard.css'
import { getStatistics, getRecentGameResults } from '../utils/db'
import DataImport from './DataImport'
import DataExport from './DataExport'
import Settings from './Settings'

function Dashboard({ setCurrentPage, setViewingResult }) {
  const [stats, setStats] = useState(null)
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showImport, setShowImport] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statistics, recent] = await Promise.all([
        getStatistics(),
        getRecentGameResults(20)
      ])
      setStats(statistics)
      setRecentGames(recent)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameClick = (game) => {
    setViewingResult(game)
    setCurrentPage('result')
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    if (diffDays === 1) return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <h1 className="title">MonkeyMath</h1>
          <p className="subtitle">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="title">MonkeyMath</h1>
            <p className="subtitle">Master arithmetic with speed and precision</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings">
              ⚙️
            </button>
            <button className="icon-btn" onClick={() => setShowImport(true)} title="Import Data">
              📥
            </button>
            <button className="icon-btn" onClick={() => setShowExport(true)} title="Export Data">
              📤
            </button>
          </div>
        </div>
      </div>

      {stats && stats.totalGames > 0 ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalGames}</div>
              <div className="stat-label">Tests</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.totalProblems}</div>
              <div className="stat-label">Problems</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value highlight">{stats.averageAccuracy}%</div>
              <div className="stat-label">Avg Accuracy</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.bestAccuracy}%</div>
              <div className="stat-label">Best</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.averageProblemsPerMinute}</div>
              <div className="stat-label">QPM</div>
            </div>
          </div>

          {recentGames.length > 0 && (
            <div className="recent-games">
              <h2 className="section-title">Recent Tests</h2>
              <div className="games-table">
                <div className="table-header">
                  <div>Date</div>
                  <div>Difficulty</div>
                  <div>Duration</div>
                  <div>Accuracy</div>
                  <div>QPM</div>
                  <div>Avg Attempts</div>
                </div>
                {recentGames.map((game) => {
                  const qpm = ((game.totalProblems / game.duration) * 60).toFixed(1)
                  const avgAttempts = game.problemHistory 
                    ? (game.problemHistory.reduce((sum, p) => sum + (p.attempts || 1), 0) / game.problemHistory.length).toFixed(1)
                    : '1.0'
                  
                  return (
                    <div 
                      key={game.id} 
                      className="table-row"
                      onClick={() => handleGameClick(game)}
                    >
                      <div className="cell-date">{formatDate(game.timestamp)}</div>
                      <div className="cell-difficulty">
                        <span className={`difficulty-badge ${game.difficulty}`}>
                          {game.difficulty}
                        </span>
                      </div>
                      <div className="cell-duration">{game.duration}s</div>
                      <div className="cell-accuracy">
                        <span className={game.accuracy >= 90 ? 'good' : game.accuracy >= 70 ? 'ok' : 'bad'}>
                          {game.accuracy}%
                        </span>
                      </div>
                      <div className="cell-qpm">{qpm}</div>
                      <div className="cell-attempts">{avgAttempts}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No tests completed yet!</p>
          <button 
            className="start-button active"
            onClick={() => setCurrentPage('config')}
          >
            Start Your First Test
          </button>
        </div>
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showImport && (
        <DataImport
          onClose={() => setShowImport(false)}
          onImportComplete={() => {
            setShowImport(false)
            loadData() // Reload dashboard data
          }}
        />
      )}
      {showExport && <DataExport onClose={() => setShowExport(false)} />}
    </div>
  )
}

export default Dashboard