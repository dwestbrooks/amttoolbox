import { ExternalLink } from 'lucide-react'

interface StudyResource {
  name: string
  tagline: string
  description: string
  url: string
  badge?: string
}

interface StudyResourceCardProps {
  resources?: StudyResource[]
  exam?: 'general' | 'airframe' | 'powerplant'
}

const DEFAULT_RESOURCES: StudyResource[] = [
  {
    name: 'Gleim A&P FAA Knowledge Test',
    tagline: 'Most used by A&P candidates',
    description:
      'Comprehensive test prep with the full FAA question bank, detailed answer explanations, and study outlines. The industry standard for written exam preparation.',
    url: 'https://www.gleim.com/aviation/a-and-p/',
    badge: 'Most Popular',
  },
  {
    name: 'King Schools A&P Certification',
    tagline: 'Video-based learning',
    description:
      'Video course covering all three A&P written exams with engaging instruction. Great for visual learners who want structured, guided study.',
    url: 'https://www.kingschools.com/ground-school/airframe-powerplant',
  },
  {
    name: "Sporty's A&P Test Prep",
    tagline: 'App-based practice',
    description:
      'Mobile-first test prep with practice questions, explanations, and performance tracking. Convenient for studying on the go.',
    url: 'https://www.sportys.com/pilot-shop/a-p-test-prep.html',
  },
]

export default function StudyResourceCard({
  resources = DEFAULT_RESOURCES,
  exam,
}: StudyResourceCardProps) {
  const examLabel = exam
    ? { general: 'General', airframe: 'Airframe', powerplant: 'Powerplant' }[exam]
    : 'A&P'

  return (
    <div className="mt-12 border-t border-slate-800 pt-10">
      <div className="max-w-3xl">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Recommended Resources</p>
        <h2 className="text-xl font-semibold text-white mb-1">
          For Comprehensive {examLabel} Exam Prep
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Our practice questions are a free supplement — for full exam prep with complete coverage and
          explanations, we recommend these resources.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resources.map(r => (
            <a
              key={r.name}
              href={r.url}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="block bg-[#1e293b] border border-slate-700 rounded-xl p-5 hover:border-[#38bdf8]/50 transition-colors group"
            >
              {r.badge && (
                <span className="inline-block text-xs bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 px-2 py-0.5 rounded-full mb-3">
                  {r.badge}
                </span>
              )}
              <p className="font-semibold text-white group-hover:text-[#38bdf8] transition-colors text-sm mb-1">
                {r.name}
              </p>
              <p className="text-xs text-slate-400 mb-3">{r.tagline}</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{r.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-[#38bdf8] font-medium">
                Visit Site <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
