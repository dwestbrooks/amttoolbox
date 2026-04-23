'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { Search } from 'lucide-react'

const WIRE_GAUGES = [
  { name: '#80', decimal: 0.0135 },
  { name: '#79', decimal: 0.0145 },
  { name: '#78', decimal: 0.0160 },
  { name: '#77', decimal: 0.0180 },
  { name: '#76', decimal: 0.0200 },
  { name: '#75', decimal: 0.0210 },
  { name: '#74', decimal: 0.0225 },
  { name: '#73', decimal: 0.0240 },
  { name: '#72', decimal: 0.0250 },
  { name: '#71', decimal: 0.0260 },
  { name: '#70', decimal: 0.0280 },
  { name: '#69', decimal: 0.0292 },
  { name: '#68', decimal: 0.0310 },
  { name: '#67', decimal: 0.0320 },
  { name: '#66', decimal: 0.0330 },
  { name: '#65', decimal: 0.0350 },
  { name: '#64', decimal: 0.0360 },
  { name: '#63', decimal: 0.0370 },
  { name: '#62', decimal: 0.0380 },
  { name: '#61', decimal: 0.0390 },
  { name: '#60', decimal: 0.0400 },
  { name: '#59', decimal: 0.0410 },
  { name: '#58', decimal: 0.0420 },
  { name: '#57', decimal: 0.0430 },
  { name: '#56', decimal: 0.0465 },
  { name: '#55', decimal: 0.0520 },
  { name: '#54', decimal: 0.0550 },
  { name: '#53', decimal: 0.0595 },
  { name: '#52', decimal: 0.0635 },
  { name: '#51', decimal: 0.0670 },
  { name: '#50', decimal: 0.0700 },
  { name: '#49', decimal: 0.0730 },
  { name: '#48', decimal: 0.0760 },
  { name: '#47', decimal: 0.0785 },
  { name: '#46', decimal: 0.0810 },
  { name: '#45', decimal: 0.0820 },
  { name: '#44', decimal: 0.0860 },
  { name: '#43', decimal: 0.0890 },
  { name: '#42', decimal: 0.0935 },
  { name: '#41', decimal: 0.0960 },
  { name: '#40', decimal: 0.0980 },
  { name: '#39', decimal: 0.0995 },
  { name: '#38', decimal: 0.1015 },
  { name: '#37', decimal: 0.1040 },
  { name: '#36', decimal: 0.1065 },
  { name: '#35', decimal: 0.1100 },
  { name: '#34', decimal: 0.1110 },
  { name: '#33', decimal: 0.1130 },
  { name: '#32', decimal: 0.1160 },
  { name: '#31', decimal: 0.1200 },
  { name: '#30', decimal: 0.1285 },
  { name: '#29', decimal: 0.1360 },
  { name: '#28', decimal: 0.1405 },
  { name: '#27', decimal: 0.1440 },
  { name: '#26', decimal: 0.1470 },
  { name: '#25', decimal: 0.1495 },
  { name: '#24', decimal: 0.1520 },
  { name: '#23', decimal: 0.1540 },
  { name: '#22', decimal: 0.1570 },
  { name: '#21', decimal: 0.1590 },
  { name: '#20', decimal: 0.1610 },
  { name: '#19', decimal: 0.1660 },
  { name: '#18', decimal: 0.1695 },
  { name: '#17', decimal: 0.1730 },
  { name: '#16', decimal: 0.1770 },
  { name: '#15', decimal: 0.1800 },
  { name: '#14', decimal: 0.1820 },
  { name: '#13', decimal: 0.1850 },
  { name: '#12', decimal: 0.1890 },
  { name: '#11', decimal: 0.1910 },
  { name: '#10', decimal: 0.1935 },
  { name: '#9', decimal: 0.1960 },
  { name: '#8', decimal: 0.1990 },
  { name: '#7', decimal: 0.2010 },
  { name: '#6', decimal: 0.2040 },
  { name: '#5', decimal: 0.2055 },
  { name: '#4', decimal: 0.2090 },
  { name: '#3', decimal: 0.2130 },
  { name: '#2', decimal: 0.2210 },
  { name: '#1', decimal: 0.2280 },
]

const LETTER_SIZES = [
  { name: 'A', decimal: 0.2340 },
  { name: 'B', decimal: 0.2380 },
  { name: 'C', decimal: 0.2420 },
  { name: 'D', decimal: 0.2460 },
  { name: 'E', decimal: 0.2500 },
  { name: 'F', decimal: 0.2570 },
  { name: 'G', decimal: 0.2610 },
  { name: 'H', decimal: 0.2660 },
  { name: 'I', decimal: 0.2720 },
  { name: 'J', decimal: 0.2770 },
  { name: 'K', decimal: 0.2810 },
  { name: 'L', decimal: 0.2900 },
  { name: 'M', decimal: 0.2950 },
  { name: 'N', decimal: 0.3020 },
  { name: 'O', decimal: 0.3160 },
  { name: 'P', decimal: 0.3230 },
  { name: 'Q', decimal: 0.3320 },
  { name: 'R', decimal: 0.3390 },
  { name: 'S', decimal: 0.3480 },
  { name: 'T', decimal: 0.3580 },
  { name: 'U', decimal: 0.3680 },
  { name: 'V', decimal: 0.3770 },
  { name: 'W', decimal: 0.3860 },
  { name: 'X', decimal: 0.3970 },
  { name: 'Y', decimal: 0.4040 },
  { name: 'Z', decimal: 0.4130 },
]

const FRACTIONAL_SIZES = [
  { name: '1/64', decimal: 1 / 64 },
  { name: '1/32', decimal: 1 / 32 },
  { name: '3/64', decimal: 3 / 64 },
  { name: '1/16', decimal: 1 / 16 },
  { name: '5/64', decimal: 5 / 64 },
  { name: '3/32', decimal: 3 / 32 },
  { name: '7/64', decimal: 7 / 64 },
  { name: '1/8', decimal: 1 / 8 },
  { name: '9/64', decimal: 9 / 64 },
  { name: '5/32', decimal: 5 / 32 },
  { name: '11/64', decimal: 11 / 64 },
  { name: '3/16', decimal: 3 / 16 },
  { name: '13/64', decimal: 13 / 64 },
  { name: '7/32', decimal: 7 / 32 },
  { name: '15/64', decimal: 15 / 64 },
  { name: '1/4', decimal: 1 / 4 },
  { name: '17/64', decimal: 17 / 64 },
  { name: '9/32', decimal: 9 / 32 },
  { name: '19/64', decimal: 19 / 64 },
  { name: '5/16', decimal: 5 / 16 },
  { name: '21/64', decimal: 21 / 64 },
  { name: '11/32', decimal: 11 / 32 },
  { name: '23/64', decimal: 23 / 64 },
  { name: '3/8', decimal: 3 / 8 },
  { name: '25/64', decimal: 25 / 64 },
  { name: '13/32', decimal: 13 / 32 },
  { name: '27/64', decimal: 27 / 64 },
  { name: '7/16', decimal: 7 / 16 },
  { name: '29/64', decimal: 29 / 64 },
  { name: '15/32', decimal: 15 / 32 },
  { name: '31/64', decimal: 31 / 64 },
  { name: '1/2', decimal: 1 / 2 },
  { name: '33/64', decimal: 33 / 64 },
  { name: '17/32', decimal: 17 / 32 },
  { name: '35/64', decimal: 35 / 64 },
  { name: '9/16', decimal: 9 / 16 },
  { name: '37/64', decimal: 37 / 64 },
  { name: '19/32', decimal: 19 / 32 },
  { name: '39/64', decimal: 39 / 64 },
  { name: '5/8', decimal: 5 / 8 },
  { name: '41/64', decimal: 41 / 64 },
  { name: '21/32', decimal: 21 / 32 },
  { name: '43/64', decimal: 43 / 64 },
  { name: '11/16', decimal: 11 / 16 },
  { name: '45/64', decimal: 45 / 64 },
  { name: '23/32', decimal: 23 / 32 },
  { name: '47/64', decimal: 47 / 64 },
  { name: '3/4', decimal: 3 / 4 },
  { name: '49/64', decimal: 49 / 64 },
  { name: '25/32', decimal: 25 / 32 },
  { name: '51/64', decimal: 51 / 64 },
  { name: '13/16', decimal: 13 / 16 },
  { name: '53/64', decimal: 53 / 64 },
  { name: '27/32', decimal: 27 / 32 },
  { name: '55/64', decimal: 55 / 64 },
  { name: '7/8', decimal: 7 / 8 },
  { name: '57/64', decimal: 57 / 64 },
  { name: '29/32', decimal: 29 / 32 },
  { name: '59/64', decimal: 59 / 64 },
  { name: '15/16', decimal: 15 / 16 },
  { name: '61/64', decimal: 61 / 64 },
  { name: '31/32', decimal: 31 / 32 },
  { name: '63/64', decimal: 63 / 64 },
  { name: '1', decimal: 1 },
]

const ALL_DRILL_SIZES = [...WIRE_GAUGES, ...LETTER_SIZES, ...FRACTIONAL_SIZES].sort((a, b) => a.decimal - b.decimal)

const relatedTools = [
  { name: 'Bend Allowance Calculator', href: '/tools/bend-allowance-calculator', description: 'Sheet metal bend calculations' },
]

export default function DecimalFractionTool() {
  const [numerator, setNumerator] = useState('')
  const [denominator, setDenominator] = useState('')
  const [decimalIn, setDecimalIn] = useState('')
  const [mm, setMm] = useState('')
  const [search, setSearch] = useState('')

  const syncFromDecimal = (val: number) => {
    setDecimalIn(val.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
    setMm((val * 25.4).toFixed(4))
  }

  const handleNumeratorChange = (v: string) => {
    setNumerator(v)
    const n = parseFloat(v)
    const d = parseFloat(denominator)
    if (!isNaN(n) && !isNaN(d) && d !== 0) syncFromDecimal(n / d)
  }

  const handleDenominatorChange = (v: string) => {
    setDenominator(v)
    const n = parseFloat(numerator)
    const d = parseFloat(v)
    if (!isNaN(n) && !isNaN(d) && d !== 0) syncFromDecimal(n / d)
  }

  const handleDecimalChange = (v: string) => {
    setDecimalIn(v)
    const val = parseFloat(v)
    if (!isNaN(val)) {
      setMm((val * 25.4).toFixed(4))
      setNumerator('')
      setDenominator('')
    }
  }

  const handleMmChange = (v: string) => {
    setMm(v)
    const val = parseFloat(v)
    if (!isNaN(val)) {
      const inches = val / 25.4
      setDecimalIn(inches.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
      setNumerator('')
      setDenominator('')
    }
  }

  const filtered = ALL_DRILL_SIZES.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.decimal.toFixed(4).includes(search) ||
    (d.decimal * 25.4).toFixed(3).includes(search)
  )

  return (
    <ToolLayout
      title="Decimal / Fraction Converter"
      description="Convert between fractional inches, decimal inches, and millimeters. Includes complete drill size chart."
      relatedTools={relatedTools}
    >
      {/* Converter */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Unit Converter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Numerator</label>
            <input
              type="number" min="0" step="1" value={numerator}
              onChange={e => handleNumeratorChange(e.target.value)}
              placeholder="e.g. 3"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Fraction top</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Denominator</label>
            <input
              type="number" min="1" step="1" value={denominator}
              onChange={e => handleDenominatorChange(e.target.value)}
              placeholder="e.g. 16"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Fraction bottom</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Decimal (inches)</label>
            <input
              type="number" step="any" value={decimalIn}
              onChange={e => handleDecimalChange(e.target.value)}
              placeholder="0.0000"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Decimal inches</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Millimeters</label>
            <input
              type="number" step="any" value={mm}
              onChange={e => handleMmChange(e.target.value)}
              placeholder="0.000"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">mm</p>
          </div>
        </div>
      </div>

      {/* Drill Size Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Drill Size Chart</h2>
            <p className="text-xs text-slate-500">Wire gauge, letter, and fractional sizes — sorted by decimal size</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search size..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#1e293b]">
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="pb-2 pr-6 pt-1">Size</th>
                <th className="pb-2 pr-6 pt-1">Decimal (in)</th>
                <th className="pb-2 pt-1">Metric (mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(row => (
                <tr key={row.name} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-1.5 pr-6 font-mono font-medium text-white">{row.name}</td>
                  <td className="py-1.5 pr-6 font-mono text-slate-300">{row.decimal.toFixed(4)}</td>
                  <td className="py-1.5 font-mono text-slate-400">{(row.decimal * 25.4).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-500">No drill sizes found matching your search.</div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-3">{filtered.length} of {ALL_DRILL_SIZES.length} sizes shown</p>
      </div>
    </ToolLayout>
  )
}
