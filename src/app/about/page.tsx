export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">About AMT Toolbox</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-slate-300 leading-relaxed mb-6">
          AMT Toolbox is a free, open-access utility site built specifically for Aircraft Maintenance
          Technicians and A&amp;P certification students. The site exists because the tools mechanics need
          day-to-day — torque calculations, bend allowance formulas, hardware lookups — are scattered
          across textbooks, manufacturer docs, and decade-old desktop apps. AMT Toolbox puts them in
          one place, optimized for the way technicians actually work: fast lookup, mobile-friendly,
          and available anywhere there&apos;s a signal.
        </p>
        <p className="text-slate-400 leading-relaxed mb-6">
          Every tool on this site is stateless and client-side — no data leaves your device, no account
          is required, and nothing is logged. The site will remain free. Period.
        </p>
        <div className="border-t border-slate-700 pt-6 mt-8">
          <p className="text-sm text-slate-500">
            <strong className="text-slate-400">Disclaimer:</strong> AMT Toolbox is provided for educational
            and reference purposes only. Always verify calculations against FAA-approved maintenance manuals,
            aircraft documentation, and applicable regulations. This site does not replace the judgment of
            a certificated aviation maintenance technician.
          </p>
        </div>
      </div>
    </div>
  )
}
