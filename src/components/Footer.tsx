import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-[#0f172a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <p className="text-white font-semibold mb-2">AMT Toolbox</p>
            <div className="flex gap-4">
              <Link href="/tools" className="text-slate-400 hover:text-white text-sm transition-colors">Tools</Link>
              <Link href="/study" className="text-slate-400 hover:text-white text-sm transition-colors">Study</Link>
              <Link href="/about" className="text-slate-400 hover:text-white text-sm transition-colors">About</Link>
            </div>
          </div>
          <div className="max-w-md">
            <p className="text-xs text-slate-500">
              Always verify calculations against approved maintenance manuals and aircraft documentation.
            </p>
            <p className="text-xs text-slate-600 mt-2">© 2025 AMT Toolbox. Free tools for aviation professionals.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
