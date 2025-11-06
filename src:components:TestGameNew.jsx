import { useState, useEffect, useRef } from 'react'
import { saveToGoogleSheets, isGoogleSheetsEnabled } from '../utils/googleSheets'
import { calculateQPM } from '../utils/timeClass'

function TestGame({ config, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(config.duration)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [answer, setAnswer] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  
  const problemHistoryRef = useRef([])
  const correctCountRef = useRef(0)
  const totalAttemptsRef = useRef(0)
  const gameEndedRef = useRef(false)

  const currentAttemptDataRef = useRef({
    submissionCount: 0,
    keystrokes: 0,
    backspaces: 0,
    lastInputTime: null,
    inputHistory: [],
    hadMistake: false,
    correctAnswerReached: false
  })

  useEffect(() => {
    generateNewProblem()
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const generateNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const generateNewProblem = () => {
    const operator = config.operators[Math.floor(Math.random() * config.operators.length)]
    let a, b, answer, display

    if (operator === '+' || operator === '-') {
      const ranges = config.ranges.addition
      a = generateNumber(ranges.minA, ranges.maxA)
      b = generateNumber(ranges.minB, ranges.maxB)
      
      if (operator === '+') {
        answer = a + b
        display = `${a} + ${b}`
      } else {
        if (a < b) [a, b] = [b, a]
        answer = a - b
        display = `${a} - ${b}`
      }
    } else {
      const ranges = config.ranges.multiplication
      a = generateNumber(ranges.minA, ranges.maxA)
      b = generateNumber(ranges.minB, ranges.maxB)
      
      if (operator === '×') {
        answer = a * b
        display = `${a} × ${b}`
      } else {
        const product = a * b
        answer = a
        display = `${product} ÷ ${b}`
      }
    }

    setCurrentProblem({ display, answer })
    currentAttemptDataRef.current = {
      submissionCount: 0,
      keystrokes: 0,
      backspaces: 0,
      lastInputTime: Date.now(),
      inputHistory: [],
      hadMistake: false,
      correctAnswerReached: false,
      startTime: Date.now()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      currentAttemptDataRef.current.backspaces++
    } else if (e.key === ' ' || e.key === 'Enter') {
      // Allow space and enter to work normally in the input
      // They don't submit, just allow typing
    }
  }

  const handleAnswerChange = (e) => {
    const value = e.target.value
    setAnswer(value)
    
    currentAttemptDataRef.current.keystrokes++
    currentAttemptDataRef.current.inputHistory.push(value)

    if (value && !isNaN(value)) {
      const userAnswer = parseInt(value)
      if (userAnswer === currentProblem.answer) {
        handleCorrectAnswer()
      }
    }
  }

  const handleCorrectAnswer = () => {
    const attemptData = currentAttemptDataRef.current
    const timeTaken = Date.now() - attemptData.startTime
    
    const backspaceRatio = attemptData.keystrokes > 0 
      ? attemptData.backspaces / attemptData.keystrokes 
      : 0
    
    let attempts = 1
    if (attemptData.backspaces > 0) {
      if (backspaceRatio > 0.5 || attemptData.backspaces >= 5) {
        attempts = 3
      } else if (backspaceRatio > 0.2 || attemptData.backspaces >= 3) {
        attempts = 2
      } else {
        attempts = 2
      }
    }

    const firstTryCorrect = attempts === 1

    problemHistoryRef.current.push({
      display: currentProblem.display,
      answer: currentProblem.answer,
      userAnswer: parseInt(answer),
      correct: true,
      firstTryCorrect,
      timeTaken,
      timestamp: Date.now(),
      attempts,
      keystrokes: attemptData.keystrokes,
      backspaces: attemptData.backspaces,
      hadMistake: !firstTryCorrect
    })

    if (firstTryCorrect) {
      correctCountRef.current++
      setCorrectCount(prev => prev + 1)
    }

    totalAttemptsRef.current++
    setTotalAttempts(prev => prev + 1)

    setAnswer('')
    generateNewProblem()
  }

  const endGame = async () => {
    if (gameEndedRef.current) return
    gameEndedRef.current = true

    const firstTryCorrect = problemHistoryRef.current.filter(p => p.firstTryCorrect).length
    const totalProblems = totalAttemptsRef.current

    const results = {
      totalProblems,
      correctAnswers: firstTryCorrect,
      firstTryCorrect,
      eventuallyCorrect: problemHistoryRef.current.filter(p => p.correct).length,
      accuracy: totalProblems > 0 ? (firstTryCorrect / totalProblems * 100).toFixed(1) : 0,
      duration: config.duration,
      problemHistory: problemHistoryRef.current,
      config,
      timestamp: Date.now(),
      difficulty: config.difficulty,
      operators: Array.isArray(config.operators) ? config.operators : Object.values(config.operators || {})
    }

    if (isGoogleSheetsEnabled()) {
      try {
        await saveToGoogleSheets(results)
        console.log('✅ Game data saved to Google Sheets')
      } catch (error) {
        console.error('❌ Failed to save to Google Sheets:', error)
      }
    }

    onFinish(results)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const qpm = calculateQPM(totalAttempts, config.duration - timeLeft)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header Stats */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <div className="text-gray-400">
            Score: <span className="text-primary-500 font-bold text-lg">{qpm || 0}</span>
          </div>
          <div className="text-gray-400">
            Questions: <span className="text-gray-100 font-semibold">{totalAttempts}</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-100 tabular-nums">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Problem Display */}
      <div className="w-full max-w-2xl text-center">
        {currentProblem && (
          <>
            <div className="text-sm text-gray-500 mb-4">
              Question #{totalAttempts + 1}
            </div>
            <div className="text-6xl font-bold text-gray-100 mb-8 tabular-nums">
              {currentProblem.display}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
              className="w-full max-w-md mx-auto text-6xl font-bold text-center bg-gray-900 border-2 border-gray-800 rounded-xl px-6 py-4 text-gray-100 placeholder-gray-700 focus:outline-none focus:border-primary-500 transition-colors tabular-nums"
              placeholder="?"
              autoFocus
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TestGame

