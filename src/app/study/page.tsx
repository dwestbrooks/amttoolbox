'use client'

import { useState } from 'react'
import { GraduationCap, BookOpen, ClipboardList, Mic } from 'lucide-react'

const comingSoon = [
  { icon: ClipboardList, title: 'Practice Questions', description: 'FAA written exam-style questions covering airframe, powerplant, and general systems.' },
  { icon: BookOpen, title: 'Systems Knowledge Base', description: 'Quick reference guides for hydraulics, pneumatics, electrical systems, and powerplant theory.' },
  { icon: Mic, title: 'Oral Exam Prep', description: 'Common oral exam questions with model answers for your A&P practical test.' },
]

export default function StudyPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-900/30 text-amber-400 text-sm font-medium px-3 py-1.5 rounded-full mb-6 border border-amber-700/30">
          <GraduationCap className="w-4 h-4" />
          Coming Soon
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">A&amp;P Exam Prep Hub</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A comprehensive study platform for A&amp;P certification candidates, built around the FAA knowledge test and practical exam standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {comingSoon.map(item => {
          const Icon = item.icon
          return (
            <div key={item.title} className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 opacity-75">
              <Icon className="w-8 h-8 text-[#38bdf8] mb-3 opacity-60" />
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-white mb-2">Get Notified When It Launches</h2>
        <p className="text-slate-400 text-sm mb-6">No spam. One email when study tools go live.</p>
        {submitted ? (
          <div className="text-[#38bdf8] font-medium">✓ You&apos;re on the list!</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
            />
            <button
              type="submit"
              className="bg-[#38bdf8] text-[#0f172a] font-semibold px-5 py-2.5 rounded-lg hover:bg-sky-300 transition-colors text-sm whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
