import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink, CheckCircle2, GraduationCap, DollarSign, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Snap-on Student Excellence Program (SEP) for A&P Students',
  description:
    'How the Snap-on Student Excellence Program works for A&P and AMT students: eligibility, purchase limits, the aviation tool sets, and how to order at student pricing.',
  alternates: {
    canonical: '/guides/snap-on-student-excellence-program',
  },
}

const sepUrl = 'https://sep.snapon.com/'
const amtSetUrl = 'https://sep.snapon.com/product/SEPAMTSETA'
const aviationCatUrl = 'https://sep.snapon.com/category/889696'

const aviationSets = [
  {
    sku: 'ATKBFL',
    name: 'Basic Flightline Kit with Tote Bag',
    price: '$3,060',
    note: 'Entry-level kit for getting started on the line.',
  },
  {
    sku: 'ATKIFL',
    name: 'Intermediate Flightline or Hangar, Tools Only',
    price: '$6,650',
    note: 'A step up for hangar and flightline work.',
  },
  {
    sku: 'SEPAMTSETA',
    name: 'AMT Aviation Maintenance Technician Set',
    price: '$6,300',
    note: 'Designed for entry-level aircraft technicians in commercial or general aviation.',
  },
  {
    sku: 'AOGMHC',
    name: '178 pc AOG Medium Mobile Tool Kit (Hard Case)',
    price: '$10,515',
    note: 'Larger mobile kit for AOG (aircraft on ground) work.',
  },
]

export default function SnapOnSepGuide() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 text-sm text-[#38bdf8] hover:text-sky-300 mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        All gear guides
      </Link>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#38bdf8]/10 text-[#38bdf8] text-sm font-medium px-3 py-1.5 rounded-full mb-4 border border-[#38bdf8]/20">
          <GraduationCap className="w-4 h-4" />
          Student program
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Snap-on Student Excellence Program (SEP) for A&amp;P Students
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          If you are a full-time A&amp;P or AMT student, Snap-on&apos;s Student Excellence Program
          lets you buy professional-grade tools at a discount — including aviation-specific sets
          built for aircraft maintenance. Here is how it works, who qualifies, and what it costs.
        </p>
      </div>

      <nav className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-semibold text-white mb-3">On this page</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300">
          <li><a href="#what" className="hover:text-[#38bdf8] transition-colors">What the SEP is</a></li>
          <li><a href="#eligible" className="hover:text-[#38bdf8] transition-colors">Who is eligible</a></li>
          <li><a href="#limits" className="hover:text-[#38bdf8] transition-colors">Purchase limits</a></li>
          <li><a href="#aviation" className="hover:text-[#38bdf8] transition-colors">Aviation tool sets</a></li>
          <li><a href="#order" className="hover:text-[#38bdf8] transition-colors">How to order and pay</a></li>
          <li><a href="#start" className="hover:text-[#38bdf8] transition-colors">How to get started</a></li>
        </ol>
      </nav>

      <div className="space-y-12 mb-12">
        <section id="what">
          <h2 className="text-2xl font-semibold text-white mb-2">What the SEP is</h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            The Student Excellence Program is Snap-on&apos;s discount program for technical students.
            It gives full-time students access to professional-quality Snap-on tools at student
            pricing — the same tools they will carry into their careers. Participants also get
            exclusive deals, tech tips, and access to industry professionals.
          </p>
          <p className="text-slate-400 leading-relaxed max-w-3xl mt-3">
            For A&amp;P students this is a real advantage: Snap-on is a major brand in aviation
            maintenance, and the program includes dedicated aviation tool sets rather than only
            automotive gear.
          </p>
        </section>

        <section id="eligible">
          <h2 className="text-2xl font-semibold text-white mb-2">Who is eligible</h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            All full-time students enrolled in an approved school program and currently fulfilling
            their curriculum requirements are eligible. That includes A&amp;P and AMT programs at
            approved Part 147 and technical schools.
          </p>
          <p className="text-slate-400 leading-relaxed max-w-3xl mt-3">
            The key word is <em>approved</em> — not every school is set up with Snap-on. Your school
            likely has a Snap-on Education Account Manager if it participates. If you are not sure,
            ask your program coordinator or instructor whether your school is part of the program.
          </p>
        </section>

        <section id="limits">
          <h2 className="text-2xl font-semibold text-white mb-2">Purchase limits</h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            While enrolled as a full-time student, you can purchase up to{' '}
            <strong className="text-white">$12,000 worth of tools</strong> (at list price value).
            You may also buy one roll cart or roll cab, and one top chest.
          </p>
          <div className="mt-4 bg-[#1e293b] border border-slate-700 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-medium">A note on the limit</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  The $12,000 figure is the current limit on Snap-on&apos;s official page. Older
                  forum posts reference a $9,500 cap, so the limit has been raised over time. If
                  you see a different number elsewhere, the official SEP page is the source of
                  truth.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="aviation">
          <h2 className="text-2xl font-semibold text-white mb-2">Aviation tool sets</h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl mb-4">
            Snap-on&apos;s SEP catalog includes a dedicated aviation category. These are the current
            sets (list prices, verified against the live SEP catalog):
          </p>
          <div className="space-y-3">
            {aviationSets.map(set => (
              <div key={set.sku} className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-white font-medium">{set.name}</h3>
                      <span className="text-sm text-[#38bdf8] font-medium">{set.price}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{set.note}</p>
                    <p className="text-xs text-slate-500 mt-1">SKU: {set.sku}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-400 leading-relaxed max-w-3xl mt-4">
            The <strong className="text-white">AMT Aviation Maintenance Technician Set</strong> is
            the one most relevant to A&amp;P students. It is designed for entry-level aircraft
            technicians and includes SAE 12-point sockets, SAE wrenches, screwdrivers, non-marring
            bronze punches, a hammer, and picks — plus specialty tools like universal and low-profile
            sockets, short-handle wrenches, ratcheting wrenches, and low-profile screwdrivers for
            hard-to-reach fasteners.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={amtSetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#38bdf8] text-[#0f172a] font-medium px-4 py-2.5 rounded-lg hover:bg-sky-300 transition-colors"
            >
              View the AMT set on SEP
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={aviationCatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1e293b] border border-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-lg hover:border-[#38bdf8] transition-colors"
            >
              Browse all aviation tools
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section id="order">
          <h2 className="text-2xl font-semibold text-white mb-2">How to order and pay</h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            You can register on the SEP website to order online, or place an order through your
            Snap-on Education Account Manager.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-[#38bdf8]" />
                <h3 className="text-white font-medium">Payment options</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Online orders accept credit and debit cards. Your Education Account Manager accepts
                all major credit cards, debit cards, checks, or a purchase order from your sponsoring
                agency.
              </p>
            </div>
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-[#38bdf8]" />
                <h3 className="text-white font-medium">Student payment plan</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Snap-on offers a student payment plan for qualifying students. See your account
                manager for details.
              </p>
            </div>
          </div>
        </section>

        <section id="start">
          <h2 className="text-2xl font-semibold text-white mb-2">How to get started</h2>
          <ol className="list-decimal list-inside text-slate-400 leading-relaxed max-w-3xl space-y-2">
            <li>
              Confirm your school participates in the SEP — ask your program coordinator or
              instructor.
            </li>
            <li>
              Contact your Snap-on Education Account Manager to get the current SEP catalog and
              confirm your eligibility.
            </li>
            <li>
              Register on the{' '}
              <a href={sepUrl} target="_blank" rel="noopener noreferrer" className="text-[#38bdf8] hover:text-sky-300">
                SEP website
              </a>{' '}
              to order online and see student pricing.
            </li>
          </ol>
        </section>
      </div>

      <section className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Is it worth it for A&amp;P students?</h2>
        <p className="text-slate-400 leading-relaxed">
          Snap-on tools are premium-priced, and the SEP discount makes them more accessible while
          you are a student. The aviation sets are built specifically for aircraft work, which is
          a real advantage over a generic automotive kit. That said, the sets are still a significant
          investment — the AMT set lists at $6,300. Many A&amp;P students build their kit gradually
          or start with a more budget-friendly set and add Snap-on pieces over time. See our{' '}
          <Link href="/guides/ap-mechanic-tool-list" className="text-[#38bdf8] hover:text-sky-300">
            A&amp;P mechanic tool list
          </Link>{' '}
          for budget and premium picks that cover the essentials.
        </p>
      </section>

      <div className="border-t border-slate-700 pt-6">
        <p className="text-sm text-slate-500">
          Program details, eligibility, and prices are from Snap-on&apos;s official SEP pages and
          were verified at the time of writing. Snap-on may change program terms — confirm current
          details with your Education Account Manager before ordering.
        </p>
      </div>
    </div>
  )
}
