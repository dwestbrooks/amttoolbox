import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'
import StudyResourceCard from '@/components/StudyResourceCard'

export const metadata: Metadata = {
  title: 'Aircraft Electrical Systems Study Guide for A&P Exam | AMT Toolbox',
  description:
    'Aircraft electrical systems study guide for the FAA Airframe written exam. Covers AC vs DC, bus architecture, circuit protection, wire sizing, and common faults.',
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

export default function AircraftElectricalSystemsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study/airframe"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Airframe Exam
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-6 h-6 text-violet-400" />
        <p className="text-xs text-slate-500 uppercase tracking-widest">Airframe Study Guide</p>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Aircraft Electrical Systems</h1>
      <p className="text-slate-400 text-sm mb-10">
        Electrical systems are a significant portion of the FAA Airframe written exam. Understanding
        system architecture, circuit protection, and wire sizing will help you both on the test and in
        the shop.
      </p>

      <Section title="1. AC vs. DC Electrical Systems">
        <p>
          Most general aviation (GA) aircraft use a <strong className="text-white">28-volt DC</strong>{' '}
          electrical system (or 14V for lighter aircraft). DC is simpler to generate and distribute and
          works well for the avionics, lighting, and motors typically found in small aircraft.
        </p>
        <p>
          Transport category (airline) aircraft use both <strong className="text-white">AC and DC</strong>:
        </p>
        <Highlight>
          <ul className="space-y-2">
            <li>
              <strong className="text-white">AC (Alternating Current)</strong> — Typically 115V, 400 Hz
              on transport aircraft. Used for high-power loads: avionics, flight instruments, large motors
              (hydraulic pumps, fuel pumps), galley equipment. AC at 400 Hz allows smaller, lighter
              transformers than 60 Hz utility power.
            </li>
            <li>
              <strong className="text-white">DC</strong> — Used for battery power, emergency systems,
              and loads that require DC (certain motors, relays). DC is derived from AC through
              transformer-rectifier units (TRUs).
            </li>
            <li>
              <strong className="text-white">Generation:</strong> GA aircraft use engine-driven alternators
              (AC → regulated to DC via integral rectifier). Transport aircraft use integrated drive
              generators (IDGs) or variable-frequency generators (VFGs) to produce AC.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="2. Bus Architecture">
        <p>
          Aircraft electrical systems distribute power through <strong className="text-white">buses</strong>
          (busbars) — common connection points that feed multiple circuits. Buses are segregated by
          criticality to ensure that a fault in one area does not cascade to critical systems.
        </p>
        <Highlight>
          <ul className="space-y-2">
            <li>
              <strong className="text-white">Main Bus</strong> — Feeds most normal electrical loads.
              Powered by the alternator/generator. Non-essential loads can be shed here if generation is
              lost.
            </li>
            <li>
              <strong className="text-white">Essential Bus</strong> — Feeds flight-critical systems
              (primary flight instruments, communication radios, warning systems). Stays powered when
              the main bus is shed. Fed directly from battery or a dedicated source.
            </li>
            <li>
              <strong className="text-white">Avionics Bus</strong> — Dedicated bus for avionics with
              voltage regulation and noise filtering. Often protected by an avionics master switch to
              prevent startup/shutdown voltage spikes from damaging sensitive equipment.
            </li>
            <li>
              <strong className="text-white">Hot Battery Bus</strong> — Always connected directly to the
              battery regardless of master switch position. Used for emergency equipment that must function
              without any switches (some fire detection, some ELT systems).
            </li>
          </ul>
        </Highlight>
        <p>
          Bus segregation also simplifies fault isolation: if a circuit breaker pops, only the circuits
          on that bus segment are affected.
        </p>
      </Section>

      <Section title="3. Circuit Protection">
        <p>
          Every circuit must be protected against overcurrent to prevent wire overheating and potential
          fire. Aircraft use two types of overcurrent protection devices:
        </p>
        <Highlight>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Fuses</strong> — One-time devices. When the rated current
              is exceeded, the fusible element melts and opens the circuit. Must be replaced (not reset).
              Used on general aviation aircraft and as backup protection. Always carry spare fuses of the
              correct rating.
            </li>
            <li>
              <strong className="text-white">Circuit Breakers (CBs)</strong> — Resettable devices. A
              tripped CB can be reset by pushing it back in. Used on most transport category aircraft and
              modern GA aircraft because they can be reset in flight without requiring spare parts.
            </li>
            <li>
              <strong className="text-white">Important rule:</strong> If a CB trips in flight, it should
              be reset <em>once</em> after a brief cooling period. If it trips again, <em>do not</em>{' '}
              reset it — the fault is still present and forcing current through a shorted circuit can
              cause fire. Report the fault for maintenance.
            </li>
            <li>
              <strong className="text-white">What CBs protect:</strong> Circuit breakers protect the
              wiring, not necessarily the equipment. The CB rating must be equal to or less than the
              wire&apos;s ampacity rating.
            </li>
          </ul>
        </Highlight>
      </Section>

      <Section title="4. Wire Sizing">
        <p>
          Selecting the correct wire gauge requires satisfying <strong className="text-white">two independent
          constraints</strong>. The final wire selection must satisfy both — pick the larger (more
          conservative) gauge:
        </p>
        <Highlight>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Constraint 1 — Ampacity:</strong> The wire must carry the
              required current without overheating. Ampacity depends on wire gauge, insulation type,
              ambient temperature, and whether the wire is in a bundle or conduit.
            </li>
            <li>
              <strong className="text-white">Constraint 2 — Voltage Drop:</strong> The wire resistance
              must be low enough that the voltage drop along the circuit does not exceed the allowable
              limit. Typical limits: 1–2% for avionics and sensitive equipment, up to 5% for lighting
              and motors. The formula for required circular mils (CM):{' '}
              <code className="bg-slate-800 px-1 rounded text-[#38bdf8]">
                CM = (K × I × 2L) / ΔV
              </code>
              {' '}where K ≈ 10.75 (for copper), I = current, L = one-way length, ΔV = allowable drop.
            </li>
          </ul>
        </Highlight>
        <p>
          Use the{' '}
          <Link href="/tools/wire-gauge-calculator" className="text-[#38bdf8] hover:underline">
            Wire Gauge Calculator
          </Link>{' '}
          to determine the correct AWG size for your circuit based on current, run length, and voltage
          drop constraints.
        </p>
        <p>
          Wire is identified by its AWG number — lower numbers are larger wire. AWG 22 is thin (suitable
          for signal circuits); AWG 4 is heavy wire for high-current buses. Aircraft wire gauge is always
          selected from AC 43.13-1B Table 11-9 or the aircraft wiring diagram manual.
        </p>
      </Section>

      <Section title="5. Common Faults and Troubleshooting">
        <p>
          Most aircraft electrical problems fall into one of three categories. Knowing how to identify
          each saves diagnostic time on the flight line:
        </p>
        <Highlight>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Open Circuit</strong> — A break in the circuit path. The
              load receives no power. Caused by a blown fuse, tripped CB, broken wire, or failed
              connector. Test with a voltmeter — check for voltage at the load side of the suspected
              break.
            </li>
            <li>
              <strong className="text-white">Short Circuit</strong> — An unintended path to ground (or
              to another conductor). Causes high current flow, trips CBs, or blows fuses. Often caused
              by chafed insulation where a wire contacts the airframe. Locate with an ohmmeter after
              removing power.
            </li>
            <li>
              <strong className="text-white">High-Resistance Connection</strong> — The most insidious
              fault. The circuit appears intact but a corroded terminal, loose connector pin, or cold
              solder joint introduces resistance that reduces current and voltage to the load. Symptoms:
              intermittent operation, dim lights, slow motors, unexplained avionics resets. Test by
              measuring voltage drop across connectors under load. Any connector should show &lt;0.1V
              drop.
            </li>
          </ul>
        </Highlight>
        <p>
          <strong className="text-white">General troubleshooting approach:</strong> Half-split the
          circuit — start in the middle, determine which half the fault is in, then repeat. Measure
          voltage under load (not just with a test light) for accurate results.
        </p>
      </Section>

      {/* CTA */}
      <div className="bg-[#1e293b] border border-violet-800/40 rounded-xl p-6 mb-8 text-center">
        <p className="text-slate-400 text-sm mb-3">Ready to test your electrical systems knowledge?</p>
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
