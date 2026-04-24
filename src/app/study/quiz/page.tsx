'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shuffle } from 'lucide-react'
import { questions } from '@/data/questions'
import QuizEngine from '@/components/QuizEngine'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MixedQuizPage() {
  const mixed = useMemo(() => shuffleArray(questions).slice(0, 20), [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Study Hub
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Shuffle className="w-6 h-6 text-[#38bdf8]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Mixed Practice Quiz</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            20 random questions drawn from all three exams
          </p>
        </div>
      </div>

      <QuizEngine
        questions={mixed}
        mode="study"
        title="Mixed Practice"
      />
    </div>
  )
}
