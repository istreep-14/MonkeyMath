import { useState, useEffect } from 'react'
import { getStatistics, getRecentGameResults } from '../utils/db'
import { getTimeClass, getTimeClassConfig, formatDuration, calculateQPM } from '../utils/timeClass'
import DataImport from './DataImport'
import DataExport from './DataExport'
import Settings from './Settings'

function Dashboard({ setCurrentPage, setViewingResult }) {
  const [stats, setStats] = useState(null)
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
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

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      easy: 'bg-green-500/10 text-green-400 border-green-500/20',
      medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      hard: 'bg-red-500/10 text-red-400 border-red-500/20',
      normal: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }
    return colors[difficulty?.toLowerCase()] || colors.normal
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
            MonkeyMath
          </div>
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-1">
            MonkeyMath
          </h1>
          <p className="text-sm text-gray-400">Master arithmetic with speed and precision</p>
        </div>
        
        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
              <button
                onClick={() => { setShowSettings(true); setShowMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 rounded-t-lg transition-colors flex items-center gap-2"
              >
                <span>⚙️</span> Settings
              </button>
              <button
                onClick={() => { setShowImport(true); setShowMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span>📥</span> Import Data
              </button>
              <button
                onClick={() => { setShowExport(true); setShowMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 rounded-b-lg transition-colors flex items-center gap-2"
              >
                <span>📤</span> Export Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-xs text-gray-400 mb-1">Total Games</div>
          <div className="text-2xl font-bold text-gray-100">{stats?.totalGames || 0}</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-400 mb-1">Avg Score</div>
          <div className="text-2xl font-bold text-primary-500">{stats?.averageQPM ? Math.round(stats.averageQPM) : 0}</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-400 mb-1">Best Score</div>
          <div className="text-2xl font-bold text-green-400">{stats?.bestQPM ? Math.round(stats.bestQPM) : 0}</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-400 mb-1">Total Questions</div>
          <div className="text-2xl font-bold text-gray-100">{stats?.totalProblems || 0}</div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Tests</h2>
        
        {recentGames.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p>No tests yet. Start your first test!</p>
            <button
              onClick={() => setCurrentPage('config')}
              className="btn-primary mt-4"
            >
              Start Test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Class</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentGames.map((game, index) => {
                  const timeClass = getTimeClass(game.duration)
                  const timeClassConfig = getTimeClassConfig(game.duration)
                  const qpm = calculateQPM(game.totalProblems, game.duration)
                  
                  return (
                    <tr
                      key={index}
                      onClick={() => handleGameClick(game)}
                      className="hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-2 text-gray-300">{formatDate(game.timestamp)}</td>
                      <td className="py-3 px-2">
                        <span className={`badge border ${getDifficultyBadge(game.difficulty || game.config?.difficulty)}`}>
                          {(game.difficulty || game.config?.difficulty || 'normal').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-400">{formatDuration(game.duration)}</td>
                      <td className="py-3 px-2">
                        <span className={`badge badge-${timeClass}`}>
                          {timeClassConfig.name.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-lg font-bold text-primary-500">{qpm}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showImport && (
        <DataImport 
          onClose={() => setShowImport(false)} 
          onImportComplete={() => {
            setShowImport(false)
            loadData()
          }}
        />
      )}
      {showExport && <DataExport onClose={() => setShowExport(false)} />}
    </div>
  )
}

export default Dashboard

