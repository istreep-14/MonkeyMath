import './Sidebar.css'

function Sidebar({ currentPage, setCurrentPage }) {
  const handleStartTest = () => {
    // Always go to config page to set up the test
    setCurrentPage('config')
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>MonkeyMath</h2>
      </div>
      
      <nav className="nav-menu">
        <button 
          className={currentPage === 'dashboard' ? 'nav-item active' : 'nav-item'}
          onClick={() => setCurrentPage('dashboard')}
        >
          <span className="icon">🏠</span>
          <span>Dashboard</span>
        </button>
        
        <button 
          className={currentPage === 'config' || currentPage === 'game' ? 'nav-item active' : 'nav-item'}
          onClick={handleStartTest}
        >
          <span className="icon">🎮</span>
          <span>Start Test</span>
        </button>
      </nav>
    </div>
  )
}

export default Sidebar