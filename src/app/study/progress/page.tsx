'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BarChart2, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { questions } from '@/data/questions'

const STORAGE_KEY = 'amttoolbox_progress'

interface ProgressEntry {
  answered: boolean
  correct: boolean
  timestamp: number
}

type ProgressData = Record<string, ProgressEntry>

function topicLabel(t: string) {
  return t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData>({})
  const [confirmReset, setConfirmReset] = useState(false)
  const [expandedExams, setExpandedExams] = useState<Set<string>>(new Set(['general', 'airframe', 'powerplant']))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProgress(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setProgress({})
    setConfirmReset(false)
  }

  function toggleExam(exam: string) {
    setExpandedExams(prev => {
      const next = new Set(prev)
      if (next.has(exam)) next.delete(exam)
      else next.add(exam)
      return next
    })
  }

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse h-8 bg-slate-800 rounded w-48 mb-8" />
        <div className="animate-pulse h-40 bg-slate-800 rounded" />
      </div>
    )
  }

  const allAnswered = Object.values(progress)
  const totalAnswered = allAnswered.length
  const totalCorrect = allAnswered.filter(e => e.correct).length
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  const exams: Array<'general' | 'airframe' | 'powerplant'> = ['general', 'airframe', 'powerplant']

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Study Hub
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <BarChart2 className="w-6 h-6 text-[#38bdf8]" />
        <h1 className="text-2xl font-bold text-white">My Progress</h1>
      </div>

      {totalAnswered === 0 ? (
        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-10 text-center">
          <p className="text-slate-400 mb-4">
            No progress recorded yet. Start practicing to see your stats here.
          </p>
          <Link
            href="/study"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#38bdf8] text-[#0f172a] font-semibold text-sm hover:bg-sky-300 transition-colors"
          >
            Start Practicing
          </Link>
        </div>
      ) : (
        <>
          {/* Overall stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-black text-white mb-1">{totalAnswered}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Questions Answered</div>
            </div>
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 text-center">
              <div
                className={`text-3xl font-black mb-1 ${
                  overallAccuracy >= 70 ? 'text-green-400' : 'text-amber-400'
                }`}
              >
                {overallAccuracy}%
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Overall Accuracy</div>
            </div>
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-black text-white mb-1">{totalCorrect}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Correct Answers</div>
            </div>
          </div>

          {/* Per-exam breakdown */}
          <div className="space-y-4 mb-8">
            {exams.map(exam => {
              const examQs = questions.filter(q => q.exam === exam)
              const answeredIds = new Set(Object.keys(progress))
              const examAnswered = examQs.filter(q => answeredIds.has(q.id))
              const examCorrect = examAnswered.filter(q => progress[q.id]?.correct)
              const examAccuracy =
                examAnswered.length > 0
                  ? Math.round((examCorrect.length / examAnswered.length) * 100)
                  : 0
              const pctDone = Math.round((examAnswered.length / examQs.length) * 100)

              // Topic breakdown
              const topicMap: Record<string, { correct: number; total: number }> = {}
              examAnswered.forEach(q => {
                if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 }
                topicMap[q.topic].total++
                if (progress[q.id]?.correct) topicMap[q.topic].correct++
              })

              const expanded = expandedExams.has(exam)

              return (
                <div key={exam} className="bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleExam(exam)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-semibold text-white capitalize">{exam} Exam</span>
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-[#38bdf8] h-1.5 rounded-full"
                            style={{ width: `${pctDone}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {examAnswered.length}/{examQs.length} done
                      </span>
                      {examAnswered.length > 0 && (
                        <span
                          className={`text-xs font-semibold ${
                            examAccuracy >= 70 ? 'text-green-400' : 'text-amber-400'
                          }`}
                        >
                          {examAccuracy}%
                        </span>
                      )}
                    </div>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 ml-3" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 ml-3" />
                    )}
                  </button>

                  {expanded && Object.keys(topicMap).length > 0 && (
                    <div className="px-6 pb-5 border-t border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 pt-4">
                        Topics
                      </p>
                      <div className="space-y-2">
                        {Object.entries(topicMap).map(([topic, { correct, total }]) => {
                          const tPct = Math.round((correct / total) * 100)
                          return (
                            <div key={topic} className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-36 shrink-0">
                                {topicLabel(topic)}
                              </span>
                              <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    tPct >= 70 ? 'bg-green-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${tPct}%` }}
                                />
                              </div>
                              <span
                                className={`text-xs font-semibold w-10 text-right ${
                                  tPct >= 70 ? 'text-green-400' : 'text-amber-400'
                                }`}
                              >
                                {tPct}%
                              </span>
                              <span className="text-xs text-slate-600 w-12 text-right">
                                {correct}/{total}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* localStorage note */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 text-sm text-slate-400 mb-8">
            <strong className="text-white">Note:</strong> Your progress is stored in your browser&apos;s
            local storage. It is not synced to any server and will be lost if you clear browser data or
            switch browsers.
          </div>

          {/* Reset */}
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" /> Reset All Progress
            </button>
          ) : (
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-red-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Reset all progress?</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-red-700 text-white text-sm hover:bg-red-600 transition-colors font-semibold"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
