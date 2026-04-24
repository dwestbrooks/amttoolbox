import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Zap, Cpu, GraduationCap, ChevronRight, Info } from 'lucide-react'
import StudyResourceCard from '@/components/StudyResourceCard'

export const metadata: Metadata = {
  title: 'Free A&P Exam Practice Questions | AMT Toolbox',
  description:
    'Free practice questions for the FAA A&P written exams. General, Airframe, and Powerplant exam prep for aircraft maintenance technicians.',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many questions are on the FAA A&P written exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each of the three A&P written exams contains 60 questions. There are three separate exams: General (60 questions), Airframe (100 questions), and Powerplant (100 questions).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the passing score for the A&P written test?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The passing score for all FAA A&P written exams is 70%. You must score at least 70% on each of the three exams separately.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long do I have to complete the A&P written exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The time limits are: General — 2 hours, Airframe — 2 hours, Powerplant — 2 hours. Most candidates complete each exam well within the time limit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use a calculator on the A&P written exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. FAA written exams allow the use of calculators. Electronic calculators without communications capabilities are permitted at most testing centers. Check with your testing center for their specific policies.',
      },
    },
  ],
}

const exams = [
  {
    href: '/study/general',
    label: 'General',
    icon: BookOpen,
    color: 'text-sky-400',
    bg: 'bg-sky-900/20 border-sky-800/40',
    description: '60 questions · 2 hour limit',
    topics: 'Covers math, regulations, publications, weight & balance, fluid lines',
  },
  {
    href: '/study/airframe',
    label: 'Airframe',
    icon: Zap,
    color: 'text-violet-400',
    bg: 'bg-violet-900/20 border-violet-800/40',
    description: '100 questions · 2 hour limit',
    topics: 'Sheet metal, hydraulics, structures, electrical systems, flight controls',
  },
  {
    href: '/study/powerplant',
    label: 'Powerplant',
    icon: Cpu,
    color: 'text-orange-400',
    bg: 'bg-orange-900/20 border-orange-800/40',
    description: '100 questions · 2 hour limit',
    topics: 'Reciprocating & turbine engines, fuel systems, propellers, ignition',
  },
]

export default function StudyIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-7 h-7 text-[#38bdf8]" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">A&amp;P Exam Prep Hub</h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl">
          Free practice questions for all three FAA A&amp;P written exams. Study by topic or take a
          full timed practice test — no sign-up required.
        </p>
      </div>

      {/* Exam cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {exams.map(exam => {
          const Icon = exam.icon
          return (
            <Link
              key={exam.href}
              href={exam.href}
              className={`block rounded-xl border p-6 hover:border-[#38bdf8]/50 transition-colors group ${exam.bg}`}
            >
              <Icon className={`w-7 h-7 mb-4 ${exam.color}`} />
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-[#38bdf8] transition-colors">
                {exam.label} Exam
              </h2>
              <p className="text-xs text-slate-400 mb-2">{exam.description}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{exam.topics}</p>
              <div className="flex items-center gap-1 text-[#38bdf8] text-xs font-medium mt-4">
                Start practicing <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* How to use */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-[#38bdf8]" />
          <h2 className="font-semibold text-white">How to Use This Section</h2>
        </div>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>
            <span className="text-white font-medium">Study Mode</span> — Questions appear one at a
            time. Select an answer to immediately see if you were right and get a full explanation.
            Great for learning concepts.
          </li>
          <li>
            <span className="text-white font-medium">Test Mode</span> — Timed exam simulation with
            no answer feedback until you submit. Mirrors the real FAA test experience.
          </li>
          <li>
            <span className="text-white font-medium">Practice by Topic</span> — Focus on weak areas
            by drilling a single topic at a time from each exam page.
          </li>
          <li>
            <span className="text-white font-medium">My Progress</span> — Your study history is
            saved locally in your browser so you can track accuracy over time.
          </li>
        </ul>
      </div>

      {/* Quick start buttons */}
      <div className="mb-2">
        <p className="text-sm text-slate-400 mb-3">Quick start:</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/study/general"
            className="px-5 py-2.5 rounded-lg bg-[#1e293b] border border-slate-700 text-sm text-white hover:border-[#38bdf8]/50 transition-colors"
          >
            Practice General
          </Link>
          <Link
            href="/study/airframe"
            className="px-5 py-2.5 rounded-lg bg-[#1e293b] border border-slate-700 text-sm text-white hover:border-[#38bdf8]/50 transition-colors"
          >
            Practice Airframe
          </Link>
          <Link
            href="/study/powerplant"
            className="px-5 py-2.5 rounded-lg bg-[#1e293b] border border-slate-700 text-sm text-white hover:border-[#38bdf8]/50 transition-colors"
          >
            Practice Powerplant
          </Link>
          <Link
            href="/study/quiz"
            className="px-5 py-2.5 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-sm text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-colors"
          >
            Mixed Practice (all exams)
          </Link>
        </div>
      </div>

      <StudyResourceCard />
    </div>
  )
}
