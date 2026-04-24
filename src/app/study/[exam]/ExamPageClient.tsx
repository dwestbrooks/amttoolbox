'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, FlaskConical, ChevronRight } from 'lucide-react'
import { questions } from '@/data/questions'
import QuizEngine from '@/components/QuizEngine'
import StudyResourceCard from '@/components/StudyResourceCard'
import type { QuizResults } from '@/components/QuizEngine'

type ExamSlug = 'general' | 'airframe' | 'powerplant'

const examConfig: Record<
  ExamSlug,
  {
    label: string
    color: string
    totalFAA: number
    time: string
    topics: string[]
  }
> = {
  general: {
    label: 'General',
    color: 'text-sky-400',
    totalFAA: 60,
    time: '2 hours',
    topics: ['math-physics', 'publications', 'ground-ops', 'weight-balance', 'fluid-lines', 'regulations'],
  },
  airframe: {
    label: 'Airframe',
    color: 'text-violet-400',
    totalFAA: 100,
    time: '2 hours',
    topics: ['sheet-metal', 'welding', 'structures', 'landing-gear', 'hydraulics', 'fuel-systems', 'electrical', 'flight-controls'],
  },
  powerplant: {
    label: 'Powerplant',
    color: 'text-orange-400',
    totalFAA: 100,
    time: '2 hours',
    topics: ['recip-theory', 'turbine-theory', 'inspections', 'fuel-metering', 'ignition', 'propellers', 'instruments', 'lubrication'],
  },
}

function topicLabel(t: string) {
  return t
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

type View = 'overview' | 'quiz'

interface ExamPageClientProps {
  exam: ExamSlug
}

export default function ExamPageClient({ exam }: ExamPageClientProps) {
  const config = examConfig[exam]
  const examQuestions = useMemo(
    () => questions.filter(q => q.exam === exam),
    [exam]
  )

  const [view, setView] = useState<View>('overview')
  const [activeQuestions, setActiveQuestions] = useState(examQuestions)
  const [quizTitle, setQuizTitle] = useState('')
  const [completedResults, setCompletedResults] = useState<QuizResults | null>(null)

  // Group questions by topic
  const topicGroups = useMemo(() => {
    const map: Record<string, number> = {}
    examQuestions.forEach(q => {
      map[q.topic] = (map[q.topic] ?? 0) + 1
    })
    return map
  }, [examQuestions])

  function startAll() {
    setActiveQuestions(examQuestions)
    setQuizTitle(`${config.label} Exam — All Questions`)
    setCompletedResults(null)
    setView('quiz')
  }

  function startTopic(topic: string) {
    const filtered = examQuestions.filter(q => q.topic === topic)
    setActiveQuestions(filtered)
    setQuizTitle(`${config.label} — ${topicLabel(topic)}`)
    setCompletedResults(null)
    setView('quiz')
  }

  function handleComplete(results: QuizResults) {
    setCompletedResults(results)
  }

  if (view === 'quiz' && !completedResults) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => setView('overview')}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to overview
        </button>
        <h1 className="text-xl font-bold text-white mb-6">{quizTitle}</h1>
        <QuizEngine
          questions={activeQuestions}
          mode="study"
          title={quizTitle}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  if (completedResults) {
    const pct = completedResults.score
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-lg mx-auto text-center">
          <div
            className={`text-6xl font-black mb-2 ${pct >= 70 ? 'text-green-400' : 'text-red-400'}`}
          >
            {pct}%
          </div>
          <p className="text-slate-300 mb-1">
            {completedResults.correct} of {completedResults.total} correct
          </p>
          <p className={`text-sm font-semibold mb-8 ${pct >= 70 ? 'text-green-400' : 'text-red-400'}`}>
            {pct >= 70 ? '✓ Passing Score' : '✗ Below Passing (70% required)'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setCompletedResults(null)
                setView('quiz')
              }}
              className="px-5 py-2.5 rounded-lg bg-[#38bdf8] text-[#0f172a] font-semibold text-sm hover:bg-sky-300 transition-colors"
            >
              Practice Again
            </button>
            <button
              onClick={() => {
                setCompletedResults(null)
                setView('overview')
              }}
              className="px-5 py-2.5 rounded-lg bg-[#1e293b] border border-slate-700 text-white text-sm hover:border-slate-500 transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All Exams
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${config.color}`}>
          {config.label} Exam
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>FAA exam: <span className="text-white">{config.totalFAA} questions</span></span>
          <span>Time limit: <span className="text-white">{config.time}</span></span>
          <span>Passing score: <span className="text-white">70%</span></span>
          <span>Our bank: <span className="text-white">{examQuestions.length} questions</span></span>
        </div>
      </div>

      {/* Practice all button */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={startAll}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#38bdf8] text-[#0f172a] font-semibold text-sm hover:bg-sky-300 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Practice All {config.label}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Topics */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-white">Practice by Topic</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {config.topics.map(topic => {
            const count = topicGroups[topic] ?? 0
            if (count === 0) return null
            return (
              <button
                key={topic}
                onClick={() => startTopic(topic)}
                className="text-left bg-[#1e293b] border border-slate-700 rounded-xl px-5 py-4 hover:border-[#38bdf8]/50 transition-colors group"
              >
                <p className="font-medium text-white text-sm group-hover:text-[#38bdf8] transition-colors">
                  {topicLabel(topic)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{count} question{count !== 1 ? 's' : ''}</p>
              </button>
            )
          })}
        </div>
      </div>

      <StudyResourceCard exam={exam} />
    </div>
  )
}
