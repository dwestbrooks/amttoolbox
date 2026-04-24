import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Cpu } from 'lucide-react'
import StudyResourceCard from '@/components/StudyResourceCard'

export const metadata: Metadata = {
  title: 'Turbine Engine Study Guide for A&P Exam | AMT Toolbox',
  description:
    'Turbine engine study guide for the FAA Powerplant written exam. Covers turbojet, turbofan, turboprop types, compressor and turbine sections, and performance parameters N1, N2, EGT, EPR.',
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

export default function TurbineEnginesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study/powerplant"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Powerplant Exam
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Cpu className="w-6 h-6 text-orange-400" />
        <p className="text-xs text-slate-500 uppercase tracking-widest">Powerplant Study Guide</p>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Turbine Engines</h1>
      <p className="text-slate-400 text-sm mb-10">
        Turbine engine theory is a major topic on the FAA Powerplant written exam. Understanding engine
        types, major sections, and performance parameters is essential for both the written test and
        your career as an A&amp;P mechanic.
      </p>

      <Section title="1. Engine Types">
        <p>
          All gas turbine engines operate on the same Brayton cycle: intake, compression, combustion,
          expansion (turbine), exhaust. The differences lie in how that energy is used.
        </p>
        <Highlight>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Turbojet</strong> — All thrust is produced by the exhaust
              jet. Highly efficient at very high speeds and altitudes. Fuel inefficient at subsonic speeds.
              Used in early jet aircraft and still found on some military jets.
            </li>
            <li>
              <strong className="text-white">Turbofan (Low bypass)</strong> — A fan moves a small amount
              of air around the core. Bypass ratio typically 1:1 to 4:1. Used in high-performance military
              aircraft (F-16, F/A-18) where speed is prioritized over efficiency.
            </li>
            <li>
              <strong className="text-white">Turbofan (High bypass)</strong> — A large fan moves a large
              volume of air around the core (bypass ratio 5:1 to 12:1). Most thrust comes from bypass
              air. The dominant engine type for commercial transport (CFM56, GE90, Trent). Best
              fuel efficiency at subsonic cruise speeds.
            </li>
            <li>
              <strong className="text-white">Turboprop</strong> — The turbine extracts most of the gas
              energy to drive a propeller through a reduction gearbox. The propeller provides the majority
              of thrust. Best efficiency at lower airspeeds (&lt;400 mph). Used on regional airliners and
              cargo aircraft (ATR 72, Dash 8, C-130).
            </li>
            <li>
              <strong className="text-white">Turboshaft</strong> — Similar to turboprop but the output
              shaft drives a rotor or other shaft load rather than a propeller. Used in helicopters
              (turboshaft to rotor gearbox) and APUs.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="2. Major Engine Sections">
        <p>
          Every gas turbine engine has the same major sections in sequence from front to rear: inlet,
          compressor, combustion, turbine, exhaust. Each section has a specific function.
        </p>
        <Highlight>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Inlet</strong> — Slows incoming air and converts velocity
              to pressure (ram recovery). On subsonic aircraft, the inlet is a diverging duct. On
              supersonic aircraft, the inlet uses shockwaves for additional compression.
            </li>
            <li>
              <strong className="text-white">Compressor</strong> — Increases air pressure before
              combustion. Two types: <em>Axial</em> (rows of rotating blades and stationary stators —
              high efficiency, used on large engines) and <em>Centrifugal</em> (impeller spins air
              outward — simpler, more robust, used on smaller engines and APUs).
            </li>
            <li>
              <strong className="text-white">Combustion Section</strong> — Fuel is injected and burned,
              raising gas temperature dramatically. Three configurations: <em>Can</em> (individual
              combustion chambers), <em>Annular</em> (single ring-shaped chamber — most common in
              modern engines), <em>Can-annular</em> (cans inside an annular structure — compromise).
            </li>
            <li>
              <strong className="text-white">Turbine Section</strong> — Extracts energy from the hot gas
              stream to drive the compressor (and fan on turbofan engines). High-pressure turbine stages
              immediately downstream of combustor; low-pressure stages further aft.
            </li>
            <li>
              <strong className="text-white">Exhaust</strong> — Accelerates and directs remaining gas
              energy to produce jet thrust. The exhaust nozzle is converging on subsonic aircraft;
              converging-diverging (CD nozzle) on supersonic military jets.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="3. Performance Parameters">
        <p>
          Turbine engine performance is monitored using several key parameters. Understanding what each
          indicates is critical for both the written exam and troubleshooting on the line.
        </p>
        <Highlight>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">N1</strong> — Rotational speed of the low-pressure (LP)
              spool, expressed as a percentage of maximum rated speed. On turbofans, N1 primarily
              represents fan speed and is the primary thrust indicator for most transport aircraft.
            </li>
            <li>
              <strong className="text-white">N2</strong> — Rotational speed of the high-pressure (HP)
              spool. On single-spool engines, N2 = engine speed. On dual-spool turbofans, N2 drives the
              HP compressor and HP turbine.
            </li>
            <li>
              <strong className="text-white">EGT (Exhaust Gas Temperature)</strong> — Temperature of
              exhaust gases leaving the turbine section. The primary engine health parameter and a
              limiting factor — exceeding EGT limits causes rapid turbine blade degradation.
            </li>
            <li>
              <strong className="text-white">EPR (Engine Pressure Ratio)</strong> — Ratio of turbine
              exit total pressure to compressor inlet total pressure. Used as a thrust setting parameter
              on some engines (notably Pratt &amp; Whitney) instead of N1.
            </li>
            <li>
              <strong className="text-white">Fuel Flow</strong> — Pounds or kilograms per hour of fuel
              consumed. Used alongside EGT for mixture and efficiency monitoring.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="4. Compressor Stall">
        <p>
          A compressor stall occurs when the angle of attack of the compressor blades exceeds the critical
          angle, causing airflow to separate from the blade surface — just like a wing stall but inside
          the engine.
        </p>
        <Highlight>
          <ul className="space-y-2">
            <li>
              <strong className="text-white">Causes:</strong> Rapid throttle advance, turbulent/disturbed
              inlet air, damaged/contaminated compressor blades, high angle of attack, operating outside
              normal envelope, FOD.
            </li>
            <li>
              <strong className="text-white">Symptoms:</strong> Loud bang, rumble, or flutter. EGT surge.
              RPM fluctuation or rollback. Backfire or visible flame from inlet or exhaust.
            </li>
            <li>
              <strong className="text-white">Recovery:</strong> Reduce throttle (reduce fuel flow).
              Restore smooth airflow to compressor. If stall persists, shut down the engine. Inspect
              before returning to service.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="5. FOD and Inspection">
        <p>
          Foreign Object Damage (FOD) is one of the most significant threats to turbine engine
          reliability. Even small objects ingested by the engine can cause blade damage that leads to
          engine failure.
        </p>
        <p>
          <strong className="text-white">Borescope inspection</strong> is the primary method for
          inspecting internal engine components without disassembly. Access ports are provided in the
          engine case at each major stage. The inspector visually examines compressor blades, combustion
          liner, and turbine blades for:
        </p>
        <Highlight>
          <ul className="list-disc ml-5 space-y-1">
            <li>Blade tip rubs and leading-edge damage (FOD)</li>
            <li>Cracks, nicks, and dents on compressor and turbine blades</li>
            <li>Hot section erosion and oxidation of turbine blades and nozzle guide vanes</li>
            <li>Combustion liner cracking and burn-through</li>
            <li>Coating degradation on thermal barrier coatings (TBCs)</li>
          </ul>
        </Highlight>
        <p>
          Damage limits are defined in the engine manufacturer&apos;s Component Maintenance Manual (CMM)
          or Overhaul Manual. Never return an engine to service with damage exceeding those limits.
        </p>
      </Section>

      {/* CTA */}
      <div className="bg-[#1e293b] border border-orange-800/40 rounded-xl p-6 mb-8 text-center">
        <p className="text-slate-400 text-sm mb-3">Ready to test your turbine engine knowledge?</p>
        <Link
          href="/study/powerplant"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#38bdf8] text-[#0f172a] font-semibold text-sm hover:bg-sky-300 transition-colors"
        >
          Practice Powerplant Questions
        </Link>
      </div>

      <StudyResourceCard exam="powerplant" />
    </div>
  )
}
