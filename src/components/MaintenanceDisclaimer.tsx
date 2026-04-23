import { AlertTriangle } from 'lucide-react'

export default function MaintenanceDisclaimer() {
  return (
    <div className="mt-8 border border-amber-700/50 bg-amber-950/30 rounded-lg p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-amber-300 font-semibold text-sm mb-1">Important Disclaimer</p>
        <p className="text-amber-200/80 text-sm leading-relaxed">
          This tool is provided for educational and reference purposes only. Always verify all calculations
          against FAA-approved maintenance manuals, aircraft documentation, and applicable regulations.
          Never use web-based tools as the sole basis for airworthiness decisions.
        </p>
      </div>
    </div>
  )
}
