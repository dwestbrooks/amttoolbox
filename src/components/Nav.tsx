'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wrench, ChevronDown, GraduationCap } from 'lucide-react'

type StudyLink = { href: string; label: string; divider?: never } | { divider: true; href?: never; label?: never }

const studyLinks: StudyLink[] = [
  { href: '/study/general', label: 'General Exam' },
  { href: '/study/airframe', label: 'Airframe Exam' },
  { href: '/study/powerplant', label: 'Powerplant Exam' },
  { divider: true },
  { href: '/study/progress', label: 'My Progress' },
  { href: '/study/quiz', label: 'All Practice (Mixed)' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const [mobileStudyOpen, setMobileStudyOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isStudyActive = pathname === '/study' || pathname.startsWith('/study/')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStudyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setStudyOpen(false)
    setOpen(false)
  }, [pathname])

  return (
    <nav className="border-b border-slate-700 bg-[#0f172a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-[#38bdf8] transition-colors"
          >
            <Wrench className="w-6 h-6 text-[#38bdf8]" />
            AMT Toolbox
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/tools"
              className={`text-sm font-medium transition-colors ${
                isActive('/tools') ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Tools
            </Link>

            {/* Study dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStudyOpen(v => !v)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isStudyActive ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Study
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${studyOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {studyOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                  <Link
                    href="/study"
                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    Study Hub
                  </Link>
                  <div className="border-t border-slate-700 my-1" />
                  {studyLinks.map((link, i) => {
                    if ('divider' in link && link.divider) {
                      return <div key={i} className="border-t border-slate-700 my-1" />
                    }
                    if ('href' in link) {
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive(link.href)
                              ? 'text-[#38bdf8]'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )
                    }
                    return null
                  })}
                </div>
              )}
            </div>

            <Link
              href="/reference"
              className={`text-sm font-medium transition-colors ${
                isActive('/reference') ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Reference
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
              }`}
            >
              About
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-700 bg-[#0f172a] px-4 py-4 space-y-1">
          <Link
            href="/tools"
            onClick={() => setOpen(false)}
            className={`block py-2 text-sm font-medium transition-colors ${
              isActive('/tools') ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Tools
          </Link>

          {/* Study section */}
          <div>
            <button
              onClick={() => setMobileStudyOpen(v => !v)}
              className={`flex items-center justify-between w-full py-2 text-sm font-medium transition-colors ${
                isStudyActive ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Study
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileStudyOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileStudyOpen && (
              <div className="pl-4 space-y-1 mb-1">
                <Link
                  href="/study"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Study Hub
                </Link>
                <Link
                  href="/study/general"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  General Exam
                </Link>
                <Link
                  href="/study/airframe"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Airframe Exam
                </Link>
                <Link
                  href="/study/powerplant"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Powerplant Exam
                </Link>
                <Link
                  href="/study/progress"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  My Progress
                </Link>
                <Link
                  href="/study/quiz"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Mixed Practice
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/reference"
            onClick={() => setOpen(false)}
            className={`block py-2 text-sm font-medium transition-colors ${
              isActive('/reference') ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Reference
          </Link>

          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className={`block py-2 text-sm font-medium transition-colors ${
              isActive('/about') ? 'text-[#38bdf8]' : 'text-slate-300 hover:text-white'
            }`}
          >
            About
          </Link>
        </div>
      )}
    </nav>
  )
}
