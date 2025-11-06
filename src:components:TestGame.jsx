import { useState, useEffect, useRef } from 'react'
import './TestGame.css'
import { saveToGoogleSheets, isGoogleSheetsEnabled } from '../utils/googleSheets'

function TestGame({ config, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(config.duration)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [answer, setAnswer] = useState('')
  const [problemHistory, setProblemHistory] = useState([])
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
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setTimeout(() => endGame(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const generateNewProblem = () => {
    const activeOperators = Object.keys(config.operators).filter(op => config.operators[op])
    if (activeOperators.length === 0) return null

    const operator = activeOperators[Math.floor(Math.random() * activeOperators.length)]
    const ranges = config.ranges
    let problem
    
    if (operator === 'addition') {
      const a = randomInRange(ranges.addition.minA, ranges.addition.maxA)
      const b = randomInRange(ranges.addition.minB, ranges.addition.maxB)
      problem = { type: 'addition', display: `${a} + ${b}`, answer: a + b, timestamp: Date.now() }
    } else if (operator === 'subtraction') {
      const a = randomInRange(ranges.addition.minA, ranges.addition.maxA)
      const b = randomInRange(ranges.addition.minB, ranges.addition.maxB)
      const c = a + b
      problem = { type: 'subtraction', display: `${c} - ${a}`, answer: b, timestamp: Date.now() }
    } else if (operator === 'multiplication') {
      const a = randomInRange(ranges.multiplication.minA, ranges.multiplication.maxA)
      const b = randomInRange(ranges.multiplication.minB, ranges.multiplication.maxB)
      problem = { type: 'multiplication', display: `${a} × ${b}`, answer: a * b, timestamp: Date.now() }
    } else {
      const a = randomInRange(ranges.multiplication.minA, ranges.multiplication.maxA)
      const b = randomInRange(ranges.multiplication.minB, ranges.multiplication.maxB)
      const c = a * b
      problem = { type: 'division', display: `${c} ÷ ${a}`, answer: b, timestamp: Date.now() }
    }
    
    setCurrentProblem(problem)
    currentAttemptDataRef.current = {
      submissionCount: 0,
      submissionCount: 0,
      keystrokes: 0,
      backspaces: 0,
      lastInputTime: Date.now(),
      inputHistory: [],
      hadMistake: false,
      correctAnswerReached: false
    }
  }

  const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const handleAnswerChange = (e) => {
    const value = e.target.value
    const previousValue = answer
    const now = Date.now()
    const attemptData = currentAttemptDataRef.current

    // Track keystrokes and backspaces
    if (value.length < previousValue.length) {
      attemptData.backspaces++
      // Any backspace indicates a mistake was made
      attemptData.hadMistake = true
    } else if (value.length > previousValue.length) {
      attemptData.keystrokes++
    }

    // Check if current value matches the correct answer
    if (currentProblem && value !== '' && /^-?\d+$/.test(value)) {
      const isCorrect = parseInt(value) === currentProblem.answer

      // If we've typed a wrong answer at any point, mark as mistake
      if (!isCorrect && value.length >= currentProblem.answer.toString().length) {
        attemptData.hadMistake = true
      }

      // Track if we ever reached the correct answer
      if (isCorrect) {
        attemptData.correctAnswerReached = true
      }
    }

    attemptData.lastInputTime = now
    attemptData.inputHistory.push({
      value,
      timestamp: now,
      wasBackspace: value.length < previousValue.length,
      isCorrect: currentProblem && value !== '' && parseInt(value) === currentProblem.answer
    })

    if (value === '' || /^-?\d+$/.test(value)) {
      setAnswer(value)

      // Auto-submit when answer is correct
      if (value !== '' && currentProblem && parseInt(value) === currentProblem.answer) {
        attemptData.submissionCount++
        setTimeout(() => checkAnswer(value), 0)
      }
    }
  }

  const handleKeyDown = (e) => {
    // Prevent Enter key from doing anything - we only auto-submit on correct answers
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const checkAnswer = (answerValue) => {
    if (answerValue === '' || !currentProblem) return

    const isCorrect = parseInt(answerValue) === currentProblem.answer
    const timeTaken = Date.now() - currentProblem.timestamp
    const attemptData = currentAttemptDataRef.current

    // Determine if this was truly first-try correct based on keystroke analysis:
    // - Must be correct
    // - No backspaces used
    // - Never typed a wrong answer
    const hadCleanInput = !attemptData.hadMistake && attemptData.backspaces === 0
    const firstTryCorrect = isCorrect && hadCleanInput

    // Calculate attempts based on mistakes:
    // - If clean input: 1 attempt
    // - If had backspaces or mistakes: estimate based on severity
    let attempts = 1
    if (attemptData.hadMistake || attemptData.backspaces > 0) {
      // Estimate attempts based on backspaces and keystrokes
      const backspaceRatio = attemptData.backspaces / Math.max(attemptData.keystrokes, 1)
      if (backspaceRatio > 0.5) {
        attempts = 3 // Heavy corrections
      } else if (backspaceRatio > 0.2 || attemptData.backspaces > 2) {
        attempts = 2 // Moderate corrections
      } else {
        attempts = 2 // Minor corrections
      }
    }

    const newProblem = {
      ...currentProblem,
      userAnswer: parseInt(answerValue),
      correct: isCorrect,
      timeTaken,
      keystrokes: attemptData.keystrokes,
      backspaces: attemptData.backspaces,
      attempts,
      firstTryCorrect,
      hadMistake: attemptData.hadMistake,
      inputHistory: attemptData.inputHistory
    }

    problemHistoryRef.current = [...problemHistoryRef.current, newProblem]
    if (firstTryCorrect) correctCountRef.current += 1
    totalAttemptsRef.current += 1

    setProblemHistory(prev => [...prev, newProblem])
    if (firstTryCorrect) setCorrectCount(prev => prev + 1)
    setTotalAttempts(prev => prev + 1)

    setAnswer('')
    generateNewProblem()
  }

  const endGame = async () => {
    // Prevent duplicate calls
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

    // Save to Google Sheets if enabled
    if (isGoogleSheetsEnabled()) {
      try {
        await saveToGoogleSheets(results)
        console.log('✅ Game data saved to Google Sheets')
      } catch (error) {
        console.error('❌ Failed to save to Google Sheets:', error)
        // Continue anyway - local save will still work
      }
    }

    onFinish(results)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentAccuracy = totalAttempts > 0 ? ((correctCount / totalAttempts) * 100).toFixed(0) : 0

  return (
    <div className="test-game">
      <div className="game-header">
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="stats">
          <span className="stat correct">{correctCount} correct</span>
          <span className="stat total">{totalAttempts} total</span>
          <span className="stat accuracy">{currentAccuracy}% accuracy</span>
        </div>
      </div>

      <div className="game-content">
        {currentProblem && (
          <>
            <div className="question-number">Question #{totalAttempts + 1}</div>
            <div className="problem-display">{currentProblem.display}</div>
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
              className="answer-input"
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