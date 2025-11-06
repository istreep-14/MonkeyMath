import { useState } from 'react'
import Sidebar from './components/SidebarNew'
import Dashboard from './components/DashboardNew'
import TestConfig from './components/TestConfigNew'
import TestGame from './components/TestGameNew'
import Results from './components/ResultsNew'
import { saveGameResult } from './utils/db'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [gameConfig, setGameConfig] = useState(null)
  const [gameResults, setGameResults] = useState(null)
  const [viewingResult, setViewingResult] = useState(null)

  const handleStartTest = (config) => {
    setGameConfig(config)
    setCurrentPage('game')
  }

  const handleGameFinish = async (results) => {
    try {
      await saveGameResult(results)
      setGameResults(results)
      setCurrentPage('result')
    } catch (error) {
      console.error('Failed to save game results:', error)
      setGameResults(results)
      setCurrentPage('result')
    }
  }

  const handleRestart = () => {
    setGameConfig(null)
    setGameResults(null)
    setViewingResult(null)
    setCurrentPage('config')
  }

  const handleDashboard = () => {
    setGameConfig(null)
    setGameResults(null)
    setViewingResult(null)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            setCurrentPage={setCurrentPage}
            setViewingResult={setViewingResult}
          />
        )
      
      case 'config':
        return <TestConfig onStart={handleStartTest} />
      
      case 'game':
        return gameConfig ? (
          <TestGame 
            config={gameConfig} 
            onFinish={handleGameFinish} 
          />
        ) : (
          <TestConfig onStart={handleStartTest} />
        )
      
      case 'result':
        const resultsToShow = viewingResult || gameResults
        return resultsToShow ? (
          <Results 
            results={resultsToShow}
            onRestart={handleRestart}
            onDashboard={handleDashboard}
          />
        ) : (
          <Dashboard 
            setCurrentPage={setCurrentPage}
            setViewingResult={setViewingResult}
          />
        )
      
      default:
        return (
          <Dashboard 
            setCurrentPage={setCurrentPage}
            setViewingResult={setViewingResult}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  )
}

export default App