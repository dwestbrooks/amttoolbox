'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import type { Question } from '@/data/questions'

export interface QuizResults {
  total: number
  correct: number
  score: number
  answers: { questionId: string; selected: string; correct: boolean }[]
  timeTaken?: number
}

interface QuizEngineProps {
  questions: Question[]
  mode: 'study' | 'test'
  onComplete?: (results: QuizResults) => void
  title?: string
}

type OptionKey = 'A' | 'B' | 'C' | 'D'

const STORAGE_KEY = 'amttoolbox_progress'

function saveStudyProgress(questionId: string, correct: boolean) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const progress: Record<string, { answered: boolean; correct: boolean; timestamp: number }> = raw
      ? JSON.parse(raw)
      : {}
    progress[questionId] = { answered: true, correct, timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ─── STUDY MODE ──────────────────────────────────────────────────────────────

function StudyMode({
  questions,
  onComplete,
}: {
  questions: Question[]
  onComplete?: (results: QuizResults) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<OptionKey | null>(null)
  const [skipped, setSkipped] = useState<Set<number>>(new Set())
  const [answers, setAnswers] = useState<QuizResults['answers']>([])

  const current = questions[currentIndex]
  const isAnswered = selected !== null
  const isCorrect = selected === current.correct
  const progressPct = ((currentIndex + 1) / questions.length) * 100

  function handleSelect(key: OptionKey) {
    if (isAnswered) return
    setSelected(key)
    const correct = key === current.correct
    saveStudyProgress(current.id, correct)
    setAnswers(prev => [...prev, { questionId: current.id, selected: key, correct }])
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      const correct = answers.filter(a => a.correct).length
      onComplete?.({
        total: questions.length,
        correct,
        score: Math.round((correct / questions.length) * 100),
        answers,
      })
    } else {
      setCurrentIndex(i => i + 1)
      setSelected(null)
    }
  }

  function handleSkip() {
    setSkipped(prev => { const s = new Set(prev); s.add(currentIndex); return s; })
    if (currentIndex + 1 >= questions.length) {
      const correct = answers.filter(a => a.correct).length
      onComplete?.({
        total: questions.length,
        correct,
        score: Math.round((correct / questions.length) * 100),
        answers,
      })
    } else {
      setCurrentIndex(i => i + 1)
      setSelected(null)
    }
  }

  function optionClass(key: OptionKey): string {
    const base =
      'w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-all duration-150 cursor-pointer '
    if (!isAnswered) {
      return base + 'bg-[#1e293b] border-slate-600 hover:border-[#38bdf8]/50 text-slate-200'
    }
    if (key === current.correct) {
      return base + 'bg-green-900/40 border-green-500 text-white'
    }
    if (key === selected && key !== current.correct) {
      return base + 'bg-red-900/40 border-red-500 text-white'
    }
    return base + 'bg-[#1e293b] border-slate-700 text-slate-400'
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs">
            {answers.filter(a => a.correct).length} correct so far
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-[#38bdf8] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-6">
          <span className="shrink-0 text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
            {current.id}
          </span>
          <p className="text-white font-medium leading-relaxed">{current.question}</p>
        </div>

        <div className="space-y-3 mb-6">
          {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => (
            <button key={key} className={optionClass(key)} onClick={() => handleSelect(key)}>
              <span className="font-semibold text-slate-400 mr-3">{key}.</span>
              {current.options[key]}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div
            className={`rounded-lg p-4 mb-4 border text-sm leading-relaxed ${
              isCorrect
                ? 'bg-green-900/20 border-green-700/50 text-green-200'
                : 'bg-slate-800 border-slate-600 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="font-semibold text-white">
                {isCorrect ? 'Correct!' : `Incorrect — correct answer: ${current.correct}`}
              </span>
            </div>
            <p>{current.explanation}</p>
            {current.reference && (
              <p className="mt-2 text-xs text-slate-400">Reference: {current.reference}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            disabled={isAnswered}
            className="text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="bg-[#38bdf8] text-[#0f172a] font-semibold px-6 py-2.5 rounded-lg hover:bg-sky-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            {currentIndex + 1 >= questions.length ? 'Finish' : 'Next Question'}
          </button>
        </div>
      </div>

      {skipped.size > 0 && (
        <p className="text-xs text-slate-500 text-center mt-3">{skipped.size} question(s) skipped</p>
      )}
    </div>
  )
}

// ─── TEST MODE ───────────────────────────────────────────────────────────────

function TestMode({
  questions,
  onComplete,
  title,
}: {
  questions: Question[]
  onComplete?: (results: QuizResults) => void
  title?: string
}) {
  const timeLimit = Math.round(questions.length * 1.5 * 60) // seconds
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testAnswers, setTestAnswers] = useState<Record<number, OptionKey>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [startTime] = useState(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current)
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const answers = questions.map((q, i) => ({
      questionId: q.id,
      selected: testAnswers[i] ?? '',
      correct: testAnswers[i] === q.correct,
    }))
    const correctCount = answers.filter(a => a.correct).length
    onComplete?.({
      total: questions.length,
      correct: correctCount,
      score: Math.round((correctCount / questions.length) * 100),
      answers,
      timeTaken,
    })
  }

  function toggleFlag(index: number) {
    setFlagged(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const current = questions[currentIndex]
  const answeredCount = Object.keys(testAnswers).length
  const timerWarning = timeLeft < 300

  function questionDotClass(i: number) {
    if (i === currentIndex)
      return 'w-8 h-8 rounded text-xs font-bold flex items-center justify-center bg-[#38bdf8] text-[#0f172a]'
    if (flagged.has(i))
      return 'w-8 h-8 rounded text-xs font-bold flex items-center justify-center bg-amber-900/60 border border-amber-500 text-amber-300'
    if (testAnswers[i])
      return 'w-8 h-8 rounded text-xs font-bold flex items-center justify-center bg-slate-600 text-white'
    return 'w-8 h-8 rounded text-xs font-bold flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-400'
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-400">
          <span className="font-semibold text-white">{title || 'Practice Test'}</span>
          <span className="mx-2 text-slate-600">|</span>
          {answeredCount}/{questions.length} answered
        </div>
        <div
          className={`flex items-center gap-1.5 font-mono text-sm font-semibold px-3 py-1 rounded-lg ${
            timerWarning
              ? 'bg-red-900/40 border border-red-700 text-red-300'
              : 'bg-slate-800 border border-slate-700 text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-1 mb-6">
        <div
          className="bg-[#38bdf8] h-1 rounded-full transition-all"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div
        className={`bg-[#1e293b] border rounded-xl p-6 mb-4 ${
          flagged.has(currentIndex) ? 'border-amber-600/60' : 'border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-start gap-3 flex-1">
            <span className="shrink-0 text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
              {current.id}
            </span>
            <p className="text-white font-medium leading-relaxed">{current.question}</p>
          </div>
          <button
            onClick={() => toggleFlag(currentIndex)}
            title={flagged.has(currentIndex) ? 'Remove flag' : 'Flag for review'}
            className={`shrink-0 p-1.5 rounded transition-colors ${
              flagged.has(currentIndex)
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-slate-500 hover:text-amber-400'
            }`}
          >
            {flagged.has(currentIndex) ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
            const isSelected = testAnswers[currentIndex] === key
            return (
              <button
                key={key}
                onClick={() => setTestAnswers(prev => ({ ...prev, [currentIndex]: key }))}
                className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#38bdf8]/10 border-[#38bdf8] text-white'
                    : 'bg-[#0f172a] border-slate-700 hover:border-[#38bdf8]/40 text-slate-300'
                }`}
              >
                <span className="font-semibold text-slate-400 mr-3">{key}.</span>
                {current.options[key]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <span className="text-sm text-slate-400">
          {currentIndex + 1} / {questions.length}
        </span>

        <button
          onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Question grid */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className={questionDotClass(i)}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-600 inline-block" /> Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-900/60 border border-amber-500 inline-block" /> Flagged
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" /> Unanswered
          </span>
        </div>
      </div>

      {/* End test */}
      {!confirmEnd ? (
        <button
          onClick={() => setConfirmEnd(true)}
          className="w-full py-3 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
        >
          End Test & See Results
        </button>
      ) : (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-red-300">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">End test?</span>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            You have answered {answeredCount} of {questions.length} questions.
            {questions.length - answeredCount > 0 &&
              ` ${questions.length - answeredCount} unanswered questions will be marked incorrect.`}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setConfirmEnd(false)}
              className="px-5 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 transition-colors"
            >
              Keep Going
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-red-700 text-white text-sm hover:bg-red-600 transition-colors font-semibold"
            >
              Submit Test
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── RESULTS SCREEN ──────────────────────────────────────────────────────────

function ResultsScreen({
  questions,
  results,
  onRetry,
}: {
  questions: Question[]
  results: QuizResults
  onRetry?: () => void
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const pass = results.score >= 70
  const missedAnswers = results.answers.filter(a => !a.correct)

  // Topic breakdown
  const topicMap: Record<string, { correct: number; total: number }> = {}
  results.answers.forEach(a => {
    const q = questions.find(q => q.id === a.questionId)
    if (!q) return
    if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 }
    topicMap[q.topic].total++
    if (a.correct) topicMap[q.topic].correct++
  })

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score card */}
      <div
        className={`rounded-xl border p-8 text-center mb-8 ${
          pass
            ? 'bg-green-900/20 border-green-700'
            : 'bg-red-900/20 border-red-800'
        }`}
      >
        <div className={`text-7xl font-black mb-2 ${pass ? 'text-green-400' : 'text-red-400'}`}>
          {results.score}%
        </div>
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${
            pass ? 'bg-green-700/40 text-green-300' : 'bg-red-800/40 text-red-300'
          }`}
        >
          {pass ? '✓ PASS' : '✗ NOT PASSING'}
        </div>
        <p className="text-slate-300 text-sm">
          {results.correct} of {results.total} correct
          {results.timeTaken != null && ` · Time: ${formatTime(results.timeTaken)}`}
        </p>
        <p className="text-xs text-slate-500 mt-1">Passing score: 70%</p>
      </div>

      {/* Topic breakdown */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
          Topic Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(topicMap).map(([topic, { correct, total }]) => {
            const pct = Math.round((correct / total) * 100)
            return (
              <div key={topic}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300 capitalize">{topic.replace(/-/g, ' ')}</span>
                  <span className={`font-semibold ${pct >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {correct}/{total} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Missed questions */}
      {missedAnswers.length > 0 && (
        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
            Missed Questions ({missedAnswers.length})
          </h3>
          <div className="space-y-3">
            {missedAnswers.map(a => {
              const q = questions.find(q => q.id === a.questionId)
              if (!q) return null
              const expanded = expandedIds.has(q.id)
              return (
                <div
                  key={q.id}
                  className="border border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-xs font-mono text-slate-500 shrink-0">{q.id}</span>
                      <span className="text-sm text-slate-300 truncate">{q.question}</span>
                    </div>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                  {expanded && (
                    <div className="px-4 pb-4 bg-slate-900/40 border-t border-slate-700">
                      <p className="text-sm text-white font-medium mb-3 pt-3">{q.question}</p>
                      <div className="space-y-1.5 mb-3">
                        {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => (
                          <div
                            key={key}
                            className={`px-3 py-2 rounded text-sm ${
                              key === q.correct
                                ? 'bg-green-900/40 text-green-200'
                                : key === a.selected
                                ? 'bg-red-900/30 text-red-300'
                                : 'text-slate-500'
                            }`}
                          >
                            <span className="font-semibold mr-2">{key}.</span>
                            {q.options[key]}
                            {key === q.correct && (
                              <span className="ml-2 text-xs text-green-400">(correct)</span>
                            )}
                            {key === a.selected && key !== q.correct && (
                              <span className="ml-2 text-xs text-red-400">(your answer)</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-300 leading-relaxed">
                        {q.explanation}
                        {q.reference && (
                          <p className="mt-2 text-xs text-slate-500">Reference: {q.reference}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full py-3 rounded-lg bg-[#38bdf8] text-[#0f172a] font-semibold hover:bg-sky-300 transition-colors"
        >
          Practice Again
        </button>
      )}
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function QuizEngine({ questions, mode, onComplete, title }: QuizEngineProps) {
  const [results, setResults] = useState<QuizResults | null>(null)
  const [key, setKey] = useState(0)

  function handleComplete(r: QuizResults) {
    setResults(r)
    onComplete?.(r)
  }

  function handleRetry() {
    setResults(null)
    setKey(k => k + 1)
  }

  if (results) {
    return (
      <ResultsScreen
        key={`results-${key}`}
        questions={questions}
        results={results}
        onRetry={handleRetry}
      />
    )
  }

  if (mode === 'study') {
    return <StudyMode key={`study-${key}`} questions={questions} onComplete={handleComplete} />
  }

  return (
    <TestMode key={`test-${key}`} questions={questions} onComplete={handleComplete} title={title} />
  )
}
