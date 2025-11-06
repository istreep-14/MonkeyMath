import { useState, useEffect } from 'react'
import './TestConfig.css'

const DIFFICULTY_RANGES = {
  easy: {
    addition: { minA: 2, maxA: 60, minB: 2, maxB: 60 },
    multiplication: { minA: 2, maxA: 12, minB: 2, maxB: 20 }
  },
  normal: {
    addition: { minA: 2, maxA: 100, minB: 2, maxB: 100 },
    multiplication: { minA: 2, maxA: 12, minB: 2, maxB: 100 }
  },
  hard: {
    addition: { minA: 2, maxA: 300, minB: 2, maxB: 300 },
    multiplication: { minA: 2, maxA: 20, minB: 2, maxB: 200 }
  }
}

const PRESET_TIMES = {
  quick: [15, 30, 60],
  standard: [120, 180, 300],
  long: [600, 900, 1800]
}

function CustomRangeInputs({ currentRanges, onSave }) {
  const [ranges, setRanges] = useState(currentRanges)

  const updateRange = (operation, field, value) => {
    const numValue = parseInt(value) || 0
    setRanges(prev => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        [field]: numValue
      }
    }))
  }

  const handleSave = () => {
    // Validate ranges
    if (ranges.addition.minA > ranges.addition.maxA || 
        ranges.addition.minB > ranges.addition.maxB ||
        ranges.multiplication.minA > ranges.multiplication.maxA ||
        ranges.multiplication.minB > ranges.multiplication.maxB) {
      alert('Min values cannot be greater than max values')
      return
    }
    onSave(ranges)
  }

  return (
    <div className="custom-ranges-section">
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: '#1a1a1a', 
        borderRadius: '8px',
        border: '1px solid #3a3a3a'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            color: '#e2b714',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Addition/Subtraction Ranges
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Min A
              </label>
              <input
                type="number"
                value={ranges.addition.minA}
                onChange={(e) => updateRange('addition', 'minA', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Max A
              </label>
              <input
                type="number"
                value={ranges.addition.maxA}
                onChange={(e) => updateRange('addition', 'maxA', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Min B
              </label>
              <input
                type="number"
                value={ranges.addition.minB}
                onChange={(e) => updateRange('addition', 'minB', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Max B
              </label>
              <input
                type="number"
                value={ranges.addition.maxB}
                onChange={(e) => updateRange('addition', 'maxB', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            color: '#e2b714',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Multiplication/Division Ranges
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Min A
              </label>
              <input
                type="number"
                value={ranges.multiplication.minA}
                onChange={(e) => updateRange('multiplication', 'minA', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Max A
              </label>
              <input
                type="number"
                value={ranges.multiplication.maxA}
                onChange={(e) => updateRange('multiplication', 'maxA', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Min B
              </label>
              <input
                type="number"
                value={ranges.multiplication.minB}
                onChange={(e) => updateRange('multiplication', 'minB', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                Max B
              </label>
              <input
                type="number"
                value={ranges.multiplication.maxB}
                onChange={(e) => updateRange('multiplication', 'maxB', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        <button
          className="custom-time-btn"
          style={{ width: '100%' }}
          onClick={handleSave}
        >
          Apply Custom Ranges
        </button>
      </div>
    </div>
  )
}


function TestConfig({ onStart }) {
  const [duration, setDuration] = useState(60)
  const [difficulty, setDifficulty] = useState('normal')
  const [operators, setOperators] = useState({
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true
  })
  const [customRanges, setCustomRanges] = useState(null)
  const [showCustomRanges, setShowCustomRanges] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [showOperatorsDropdown, setShowOperatorsDropdown] = useState(false)
  const [customTime, setCustomTime] = useState('')

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleStart()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [duration, difficulty, operators])

  const handleStart = () => {
    const activeOperators = Object.values(operators).some(v => v)
    if (!activeOperators) {
      alert('Please select at least one operator')
      return
    }

    const config = {
      duration,
      difficulty: customRanges ? 'custom' : difficulty,
      operators,
      ranges: customRanges || DIFFICULTY_RANGES[difficulty]
    }
    onStart(config)
  }

  const toggleOperator = (op) => {
    setOperators(prev => ({ ...prev, [op]: !prev[op] }))
  }

  const setPresetTime = (time) => {
    setDuration(time)
    setShowTimeDropdown(false)
  }

  const handleCustomTime = () => {
    const time = parseInt(customTime)
    if (time && time > 0 && time <= 3600) {
      setDuration(time)
      setCustomTime('')
      setShowTimeDropdown(false)
    }
  }

  const getOperatorsPreview = () => {
    const activeOps = []
    if (operators.addition) activeOps.push('+')
    if (operators.subtraction) activeOps.push('−')
    if (operators.multiplication) activeOps.push('×')
    if (operators.division) activeOps.push('÷')
    return activeOps.join('  ') || 'None'
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  return (
    <div className="test-config">
      <div className="config-container chess-style">
        <h1 className="config-title">Configure Test</h1>

        {/* Time Control */}
        <div className="config-section time-control-header">
          <button 
            className="dropdown-trigger"
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          >
            <span className="category-badge">⏱️ Time</span>
            <span className="selected-time">{formatTime(duration)}</span>
            <span className="dropdown-arrow">{showTimeDropdown ? '▲' : '▼'}</span>
          </button>

          {showTimeDropdown && (
            <div className="dropdown-panel">
              <div className="time-category">
                <div className="category-header">Quick</div>
                <div className="time-options">
                  {PRESET_TIMES.quick.map(time => (
                    <button
                      key={time}
                      className={`time-btn ${duration === time ? 'active' : ''}`}
                      onClick={() => setPresetTime(time)}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-category">
                <div className="category-header">Standard</div>
                <div className="time-options">
                  {PRESET_TIMES.standard.map(time => (
                    <button
                      key={time}
                      className={`time-btn ${duration === time ? 'active' : ''}`}
                      onClick={() => setPresetTime(time)}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-category">
                <div className="category-header">Long</div>
                <div className="time-options">
                  {PRESET_TIMES.long.map(time => (
                    <button
                      key={time}
                      className={`time-btn ${duration === time ? 'active' : ''}`}
                      onClick={() => setPresetTime(time)}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-time-section">
                <input
                  type="number"
                  className="custom-time-input"
                  placeholder="Custom (seconds)"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  min="1"
                  max="3600"
                />
                <button 
                  className="custom-time-btn"
                  onClick={handleCustomTime}
                  disabled={!customTime || parseInt(customTime) <= 0}
                >
                  Set
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="config-section">
          <button 
            className="dropdown-trigger"
            onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
          >
            <span className="category-badge">🎯</span>
            <span className="difficulty-label">
              {customRanges ? 'Custom' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <span className="dropdown-arrow">{showDifficultyDropdown ? '▲' : '▼'}</span>
          </button>

          {showDifficultyDropdown && (
            <div className="dropdown-panel">
              <div className="difficulty-section">
                <div className="difficulty-buttons">
                  <button
                    className={`diff-btn ${difficulty === 'easy' && !customRanges ? 'active' : ''}`}
                    onClick={() => {
                      setDifficulty('easy')
                      setCustomRanges(null)
                      setShowCustomRanges(false)
                    }}
                  >
                    Easy
                  </button>
                  <button
                    className={`diff-btn ${difficulty === 'normal' && !customRanges ? 'active' : ''}`}
                    onClick={() => {
                      setDifficulty('normal')
                      setCustomRanges(null)
                      setShowCustomRanges(false)
                    }}
                  >
                    Normal
                  </button>
                  <button
                    className={`diff-btn ${difficulty === 'hard' && !customRanges ? 'active' : ''}`}
                    onClick={() => {
                      setDifficulty('hard')
                      setCustomRanges(null)
                      setShowCustomRanges(false)
                    }}
                  >
                    Hard
                  </button>
                </div>

                <div className="difficulty-info">
                  <div className="range-display">
                    <span className="range-label">Addition/Subtraction (a):</span>
                    <span className="range-value">
                      {(customRanges || DIFFICULTY_RANGES[difficulty]).addition.minA}-{(customRanges || DIFFICULTY_RANGES[difficulty]).addition.maxA}
                    </span>
                  </div>
                  <div className="range-display">
                    <span className="range-label">Addition/Subtraction (b):</span>
                    <span className="range-value">
                      {(customRanges || DIFFICULTY_RANGES[difficulty]).addition.minB}-{(customRanges || DIFFICULTY_RANGES[difficulty]).addition.maxB}
                    </span>
                  </div>
                  <div className="range-display">
                    <span className="range-label">Multiplication/Division (a):</span>
                    <span className="range-value">
                      {(customRanges || DIFFICULTY_RANGES[difficulty]).multiplication.minA}-{(customRanges || DIFFICULTY_RANGES[difficulty]).multiplication.maxA}
                    </span>
                  </div>
                  <div className="range-display">
                    <span className="range-label">Multiplication/Division (b):</span>
                    <span className="range-value">
                      {(customRanges || DIFFICULTY_RANGES[difficulty]).multiplication.minB}-{(customRanges || DIFFICULTY_RANGES[difficulty]).multiplication.maxB}
                    </span>
                  </div>
                </div>

                <button
                  className="custom-time-btn"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => setShowCustomRanges(!showCustomRanges)}
                >
                  {showCustomRanges ? 'Hide' : 'Show'} Custom Ranges
                </button>

                {showCustomRanges && (
                  <CustomRangeInputs
                    currentRanges={customRanges || DIFFICULTY_RANGES[difficulty]}
                    onSave={(ranges) => {
                      setCustomRanges(ranges)
                      setShowCustomRanges(false)
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operators */}
        <div className="config-section">
          <button 
            className="dropdown-trigger"
            onClick={() => setShowOperatorsDropdown(!showOperatorsDropdown)}
          >
            <span className="category-badge">🔢</span>
            <span className="operators-preview">{getOperatorsPreview()}</span>
            <span className="dropdown-arrow">{showOperatorsDropdown ? '▲' : '▼'}</span>
          </button>

          {showOperatorsDropdown && (
            <div className="dropdown-panel">
              <div className="operators-section">
                <div className="section-label">Select Operators</div>
                <div className="operators-grid">
                  <label className="operator-checkbox">
                    <input
                      type="checkbox"
                      checked={operators.addition}
                      onChange={() => toggleOperator('addition')}
                    />
                    <span className="operator-symbol">+</span>
                    <span className="operator-name">Addition</span>
                  </label>

                  <label className="operator-checkbox">
                    <input
                      type="checkbox"
                      checked={operators.subtraction}
                      onChange={() => toggleOperator('subtraction')}
                    />
                    <span className="operator-symbol">−</span>
                    <span className="operator-name">Subtraction</span>
                  </label>

                  <label className="operator-checkbox">
                    <input
                      type="checkbox"
                      checked={operators.multiplication}
                      onChange={() => toggleOperator('multiplication')}
                    />
                    <span className="operator-symbol">×</span>
                    <span className="operator-name">Multiplication</span>
                  </label>

                  <label className="operator-checkbox">
                    <input
                      type="checkbox"
                      checked={operators.division}
                      onChange={() => toggleOperator('division')}
                    />
                    <span className="operator-symbol">÷</span>
                    <span className="operator-name">Division</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="start-section">
          <button className="start-button active" onClick={handleStart}>
            Start Test
          </button>
          <p className="hint">Press <kbd>Space</kbd> or <kbd>Enter</kbd> to start</p>
        </div>
      </div>
    </div>
  )
}

export default TestConfig