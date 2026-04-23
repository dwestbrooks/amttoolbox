import MaintenanceDisclaimer from './MaintenanceDisclaimer'
import Link from 'next/link'

interface RelatedTool {
  name: string
  href: string
  description: string
}

interface ToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  relatedTools?: RelatedTool[]
}

export default function ToolLayout({ title, description, children, relatedTools = [] }: ToolLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400">{description}</p>
      </div>
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {children}
          <MaintenanceDisclaimer />
        </div>
        {relatedTools.length > 0 && (
          <aside className="xl:w-72 flex-shrink-0">
            <div className="bg-[#1e293b] rounded-lg p-4 sticky top-24">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Related Tools</h2>
              <div className="space-y-3">
                {relatedTools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="block p-3 rounded-md border border-slate-700 hover:border-[#38bdf8]/50 hover:bg-slate-800 transition-all group"
                  >
                    <p className="text-sm font-medium text-white group-hover:text-[#38bdf8] transition-colors">{tool.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
