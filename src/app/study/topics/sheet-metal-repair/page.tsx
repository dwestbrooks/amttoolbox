import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Wrench } from 'lucide-react'
import StudyResourceCard from '@/components/StudyResourceCard'

export const metadata: Metadata = {
  title: 'Sheet Metal Repair Study Guide for A&P Exam | AMT Toolbox',
  description:
    'Complete study guide for aircraft sheet metal repair. Covers repair classifications, rivet selection, corrosion treatment, and bend allowance for the FAA Airframe written exam.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">{title}</h2>
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-sm text-slate-300 leading-relaxed">
      {children}
    </div>
  )
}

export default function SheetMetalRepairPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study/airframe"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Airframe Exam
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Wrench className="w-6 h-6 text-violet-400" />
        <p className="text-xs text-slate-500 uppercase tracking-widest">Airframe Study Guide</p>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Sheet Metal Repair</h1>
      <p className="text-slate-400 text-sm mb-10">
        Sheet metal repair is heavily tested on the FAA Airframe written exam. Master rivet selection,
        damage classification, and repair procedures to score well in this category.
      </p>

      <Section title="1. Types of Aircraft Sheet Metal">
        <p>
          The most common aluminum alloy used for aircraft skin is <strong className="text-white">2024-T3</strong>.
          It offers high strength, good fatigue resistance, and excellent machinability. The &ldquo;T3&rdquo; designator
          means the alloy was solution heat treated and then cold worked (strain hardened). It is used for
          fuselage skin, wing skin, and primary structural panels.
        </p>
        <p>
          <strong className="text-white">6061-T6</strong> is a more corrosion-resistant alloy used for
          less-structurally-critical parts such as ribs, brackets, and fairings. It is easier to weld than
          2024 but has lower fatigue strength, so it is not used for primary skin panels on transport
          category aircraft.
        </p>
        <Highlight>
          <strong className="text-white">Key property comparison:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>2024-T3: High strength, moderate corrosion resistance — primary structural skin</li>
            <li>6061-T6: Good corrosion resistance, weldable — secondary structure and fittings</li>
            <li>7075-T6: Highest strength of common alloys — spars, highly loaded fittings</li>
          </ul>
        </Highlight>
      </Section>

      <Section title="2. Damage Classifications">
        <p>
          When an aircraft sustains damage to sheet metal, the mechanic must classify the damage to
          determine the correct course of action. Per AC 43.13-1B and the aircraft&apos;s Structural Repair
          Manual (SRM), damage falls into three categories:
        </p>
        <Highlight>
          <ul className="space-y-2">
            <li>
              <strong className="text-white">Negligible Damage</strong> — Small scratches, dents, or
              nicks that can be polished out or left as-is without structural concern. No repair needed.
              Damage limits for negligible damage are defined in the SRM.
            </li>
            <li>
              <strong className="text-white">Repairable Damage</strong> — Damage that exceeds negligible
              limits but can be repaired by stop-drilling (for cracks), patch repair, or doubler
              installation. The SRM specifies the maximum repairable damage size.
            </li>
            <li>
              <strong className="text-white">Beyond Limits (Replacement Required)</strong> — Damage that
              exceeds the maximum repairable damage limit. The affected skin panel, stringer, or frame
              must be replaced. Only approved replacement parts from the manufacturer may be used.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="3. Stop-Drilling Cracks">
        <p>
          Cracks in sheet metal propagate because of stress concentration at the crack tip. The standard
          technique to arrest crack growth is <strong className="text-white">stop-drilling</strong>: drilling
          a small hole at the tip of the crack to eliminate the sharp stress concentration and distribute
          the stress over a larger area.
        </p>
        <p>
          The standard stop-drill size is <strong className="text-white">#30 drill (approximately 1/8 inch)</strong>.
          The hole must be centered precisely at the crack tip — not beyond it. After stop-drilling, the area
          must be evaluated to determine whether a patch or doubler repair is also required.
        </p>
        <Highlight>
          <strong className="text-white">Stop-drill procedure:</strong>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Dye penetrant or magnification to find exact crack tip location</li>
            <li>Mark the center of the stop-drill hole at the crack tip</li>
            <li>Drill with a #30 (0.128&Prime;) drill bit, deburr both sides</li>
            <li>Inspect for additional cracks before closing the area</li>
          </ol>
        </Highlight>
      </Section>

      <Section title="4. Rivet Selection Rules">
        <p>
          Choosing the correct rivet is critical. The wrong diameter or inadequate edge/pitch distance will
          result in a weak or failed repair. The key rules from AC 43.13-1B:
        </p>
        <Highlight>
          <ul className="space-y-2">
            <li>
              <strong className="text-white">Diameter rule:</strong> Rivet diameter = 3 × thickness of the
              thickest sheet. Round up to the nearest standard diameter (3/32, 1/8, 5/32, 3/16 inch).
            </li>
            <li>
              <strong className="text-white">Minimum edge distance:</strong> 2× rivet diameter (2D) from
              the center of the rivet to the edge of the material. Recommended is 2.5D.
            </li>
            <li>
              <strong className="text-white">Minimum rivet pitch (spacing):</strong> 3× rivet diameter
              (3D) center-to-center. Recommended pitch is 4D to 6D.
            </li>
            <li>
              <strong className="text-white">Head type:</strong> AN426 (100° flush/countersunk) for
              aerodynamic surfaces. AN470 (universal/round head) for non-aerodynamic or structural repairs.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="5. Corrosion Treatment">
        <p>
          Corrosion is one of the most common causes of structural damage in aircraft. The treatment
          procedure follows a defined sequence:
        </p>
        <Highlight>
          <ol className="list-decimal ml-5 space-y-2">
            <li>
              <strong className="text-white">Identify</strong> the type of corrosion: surface (white/gray
              powder on aluminum), intergranular (along grain boundaries), galvanic (dissimilar metals in
              contact), or pitting.
            </li>
            <li>
              <strong className="text-white">Remove</strong> all corrosion products. For aluminum: use
              aluminum wool, Scotch-Brite, or a chemical conversion coating process. Never use steel
              tools on aluminum — they will cause galvanic contamination.
            </li>
            <li>
              <strong className="text-white">Treat</strong> the cleaned surface with a chemical conversion
              coating (Alodine/Iridite) to restore corrosion resistance without removing base material.
            </li>
            <li>
              <strong className="text-white">Seal and protect</strong> with an epoxy primer and topcoat.
              Seal all seams with approved sealant to prevent moisture intrusion.
            </li>
          </ol>
        </Highlight>
      </Section>

      <Section title="6. Bend Allowance">
        <p>
          When sheet metal is bent, the outer surface is stretched and the inner surface is compressed.
          The <strong className="text-white">neutral axis</strong> — located approximately 0.445× the
          material thickness from the inside — is the line that neither stretches nor compresses. Bend
          allowance is the arc length along the neutral axis.
        </p>
        <p>
          The bend allowance formula:{' '}
          <code className="bg-slate-800 px-2 py-0.5 rounded text-[#38bdf8]">
            BA = (0.01743 × R + 0.0078 × T) × degrees
          </code>{' '}
          where R is the inside bend radius and T is the material thickness. For exam purposes, bend
          allowance tables are usually provided.
        </p>
        <p>
          Use the{' '}
          <Link href="/tools/bend-allowance-calculator" className="text-[#38bdf8] hover:underline">
            Bend Allowance Calculator
          </Link>{' '}
          to calculate setback and flat pattern dimensions for your repair.
        </p>
      </Section>

      {/* CTA */}
      <div className="bg-[#1e293b] border border-violet-800/40 rounded-xl p-6 mb-8 text-center">
        <p className="text-slate-400 text-sm mb-3">Ready to test your knowledge?</p>
        <Link
          href="/study/airframe"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#38bdf8] text-[#0f172a] font-semibold text-sm hover:bg-sky-300 transition-colors"
        >
          Practice Airframe Questions
        </Link>
      </div>

      <StudyResourceCard exam="airframe" />
    </div>
  )
}
