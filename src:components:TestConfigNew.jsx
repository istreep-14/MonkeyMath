import { useState } from 'react'
import { TIME_CLASSES, TIME_CLASS_CONFIG } from '../utils/timeClass'

const DIFFICULTY_RANGES = {
  easy: {
    addition: { minA: 2, maxA: 60, minB: 2, maxB: 60 },
    multiplication: { minA: 2, maxA: 12, minB: 2, maxB: 20 }
  },
  medium: {
    addition: { minA: 2, maxA: 100, minB: 2, maxB: 100 },
    multiplication: { minA: 2, maxA: 12, minB: 2, maxB: 100 }
  },
  hard: {
    addition: { minA: 2, maxA: 300, minB: 2, maxB: 300 },
    multiplication: { minA: 2, maxA: 20, minB: 2, maxB: 200 }
  }
}

function TestConfig({ onStart }) {
  const [openSection, setOpenSection] = useState('time')
  const [duration, setDuration] = useState(60)
  const [difficulty, setDifficulty] = useState('medium')
  const [operators, setOperators] = useState(['+', '-', '×', '÷'])
  const [customTime, setCustomTime] = useState('')

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  const toggleOperator = (op) => {
    if (operators.includes(op)) {
      if (operators.length > 1) {
        setOperators(operators.filter(o => o !== op))
      }
    } else {
      setOperators([...operators, op])
    }
  }

  const handleStart = () => {
    const config = {
      duration,
      difficulty,
      operators,
      ranges: DIFFICULTY_RANGES[difficulty]
    }
    onStart(config)
  }

  const setPresetTime = (seconds) => {
    setDuration(seconds)
    setCustomTime('')
  }

  const handleCustomTime = (value) => {
    setCustomTime(value)
    const seconds = parseInt(value)
    if (seconds > 0) {
      setDuration(seconds)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
          Test Setup
        </h1>
        <p className="text-sm text-gray-400">Configure your arithmetic speed test</p>
      </div>

      <div className="space-y-3">
        {/* Time Selection Accordion */}
        <div className="card">
          <button
            onClick={() => toggleSection('time')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <div className="text-sm font-semibold text-gray-100">Time Limit</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {duration}s {duration >= 60 && `(${Math.floor(duration / 60)}m)`}
              </div>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openSection === 'time' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'time' && (
            <div className="mt-4 pt-4 border-t border-gray-800 space-y-4">
              {/* Bullet */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-bullet">BULLET</span>
                  <span className="text-xs text-gray-400">Lightning fast</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_CLASS_CONFIG[TIME_CLASSES.BULLET].durations.map(seconds => (
                    <button
                      key={seconds}
                      onClick={() => setPresetTime(seconds)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        duration === seconds
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Blitz */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-blitz">BLITZ</span>
                  <span className="text-xs text-gray-400">Quick thinking</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_CLASS_CONFIG[TIME_CLASSES.BLITZ].durations.map(seconds => (
                    <button
                      key={seconds}
                      onClick={() => setPresetTime(seconds)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        duration === seconds
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {seconds / 60}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Rapid */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-rapid">RAPID</span>
                  <span className="text-xs text-gray-400">Steady pace</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_CLASS_CONFIG[TIME_CLASSES.RAPID].durations.map(seconds => (
                    <button
                      key={seconds}
                      onClick={() => setPresetTime(seconds)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        duration === seconds
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {seconds / 60}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom */}
              <div>
                <label className="text-xs text-gray-400 block mb-2">Custom (seconds)</label>
                <input
                  type="number"
                  value={customTime}
                  onChange={(e) => handleCustomTime(e.target.value)}
                  placeholder="Enter custom time..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Accordion */}
        <div className="card">
          <button
            onClick={() => toggleSection('difficulty')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <div className="text-sm font-semibold text-gray-100">Difficulty</div>
              <div className="text-xs text-gray-400 mt-0.5 capitalize">{difficulty}</div>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openSection === 'difficulty' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'difficulty' && (
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all capitalize ${
                    difficulty === diff
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operators Accordion */}
        <div className="card">
          <button
            onClick={() => toggleSection('operators')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <div className="text-sm font-semibold text-gray-100">Operators</div>
              <div className="text-xs text-gray-400 mt-0.5">{operators.join(' ')}</div>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openSection === 'operators' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'operators' && (
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-4 gap-2">
              {['+', '-', '×', '÷'].map(op => (
                <button
                  key={op}
                  onClick={() => toggleOperator(op)}
                  className={`px-3 py-3 text-lg font-bold rounded-lg border transition-all ${
                    operators.includes(op)
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full mt-6 py-4 btn-primary text-lg font-bold"
      >
        Start Test
      </button>

      <div className="mt-4 text-center text-xs text-gray-500">
        Press Space or Enter to begin when ready
      </div>
    </div>
  )
}

export default TestConfig

