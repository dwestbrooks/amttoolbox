'use client'

import { useState, useMemo } from 'react'

const ABBREVIATIONS = [
  { abbr: 'A&P', full: 'Airframe & Powerplant', explanation: 'The two ratings required for FAA aircraft mechanic certification (14 CFR Part 65).' },
  { abbr: 'ACARS', full: 'Aircraft Communications Addressing and Reporting System', explanation: 'Digital data link for aircraft-ground communications.' },
  { abbr: 'ACAS', full: 'Airborne Collision Avoidance System', explanation: 'ICAO term for TCAS; onboard system that alerts crew to traffic conflicts.' },
  { abbr: 'ACM', full: 'Aircraft Component Maintenance', explanation: 'General term for component-level maintenance and repair activities.' },
  { abbr: 'AD', full: 'Airworthiness Directive', explanation: 'FAA-mandated action required to correct an unsafe condition in an aircraft or component.' },
  { abbr: 'ADF', full: 'Automatic Direction Finder', explanation: 'Radio navigation instrument that displays bearing to an NDB ground station.' },
  { abbr: 'ADL', full: 'Allowable Damage Limits', explanation: 'Defined limits within which structural damage is acceptable without repair.' },
  { abbr: 'ADS-B', full: 'Automatic Dependent Surveillance-Broadcast', explanation: 'Aircraft position broadcast system required by FAA since Jan 2020.' },
  { abbr: 'AFMS', full: 'Airplane Flight Manual Supplement', explanation: 'Document supplementing the AFM for a specific modification or equipment change.' },
  { abbr: 'AGE', full: 'Aerospace Ground Equipment', explanation: 'Equipment used on the ground to support aircraft maintenance and servicing.' },
  { abbr: 'AHM', full: 'Aircraft Health Monitoring', explanation: 'System that monitors aircraft systems in real time and reports anomalies.' },
  { abbr: 'AME', full: 'Aviation Medical Examiner', explanation: 'FAA-designated physician authorized to conduct airman medical examinations.' },
  { abbr: 'AMM', full: 'Aircraft Maintenance Manual', explanation: "The manufacturer's primary maintenance reference document for a specific aircraft type." },
  { abbr: 'AMOC', full: 'Alternative Method of Compliance', explanation: 'FAA-approved alternate means of complying with an Airworthiness Directive.' },
  { abbr: 'AMOS', full: 'Aircraft Maintenance and Operations System', explanation: 'Software platform for managing maintenance records and planning.' },
  { abbr: 'AMT', full: 'Aircraft Maintenance Technician', explanation: 'FAA-certificated mechanic holding Airframe and/or Powerplant ratings.' },
  { abbr: 'AOG', full: 'Aircraft on Ground', explanation: 'Status indicating an aircraft is grounded due to a defect, awaiting parts or repair.' },
  { abbr: 'APB', full: 'Airworthiness Parts Bulletin', explanation: 'Document from an OEM regarding parts that may affect airworthiness.' },
  { abbr: 'APU', full: 'Auxiliary Power Unit', explanation: 'Small turbine engine providing ground power and bleed air independent of main engines.' },
  { abbr: 'ASB', full: 'Alert Service Bulletin', explanation: 'Service bulletin requiring prompt attention due to safety significance.' },
  { abbr: 'ATA', full: 'Air Transport Association', explanation: 'Industry standard numbering system (ATA iSpec 2200) used to organize aircraft maintenance manuals.' },
  { abbr: 'ATA 100', full: 'ATA 100 Specification', explanation: 'Legacy chapter numbering system for aircraft maintenance manuals (superseded by ATA iSpec 2200).' },
  { abbr: 'AWL', full: 'Airworthiness Limitation', explanation: 'Mandatory maintenance task defined in the ICA that cannot be deviated from without FAA approval.' },
  { abbr: 'BIT', full: 'Built-In Test', explanation: 'Self-diagnostic capability built into avionics or electronic systems to detect faults.' },
  { abbr: 'BITE', full: 'Built-In Test Equipment', explanation: 'Hardware and software providing automated fault detection and isolation.' },
  { abbr: 'BTB', full: 'Bus Tie Breaker', explanation: 'Electrical component that connects or isolates electrical buses in aircraft power distribution.' },
  { abbr: 'BVM', full: 'Borescope Visual Inspection', explanation: 'Internal inspection using a borescope camera, commonly used for engine cylinder inspections.' },
  { abbr: 'CAA', full: 'Civil Aviation Authority', explanation: 'National aviation authority (used primarily in UK and other countries; FAA equivalent).' },
  { abbr: 'CAME', full: 'Continuing Airworthiness Management Exposition', explanation: "Document describing an operator's airworthiness management system (EASA)." },
  { abbr: 'CAS', full: 'Calibrated Airspeed', explanation: 'Indicated airspeed corrected for instrument and installation error.' },
  { abbr: 'CDCCL', full: 'Critical Design Configuration Control Limitations', explanation: 'Specific design features that must be maintained to prevent fuel tank ignition.' },
  { abbr: 'CDL', full: 'Configuration Deviation List', explanation: 'List of aircraft external parts that may be missing for a specific flight per the AFM.' },
  { abbr: 'CMM', full: 'Component Maintenance Manual', explanation: "Manufacturer's manual for overhaul and repair of a specific component or LRU." },
  { abbr: 'CMP', full: 'Configuration, Maintenance & Procedures', explanation: 'Document defining required configuration and maintenance for ETOPS operations.' },
  { abbr: 'CofA', full: 'Certificate of Airworthiness', explanation: 'Document issued by the NAA certifying the aircraft meets airworthiness standards.' },
  { abbr: 'COR', full: 'Certificate of Release', explanation: 'Document signed by an authorized person certifying that maintenance has been completed.' },
  { abbr: 'CRS', full: 'Certificate of Release to Service', explanation: 'UK/EASA equivalent of a return-to-service signoff.' },
  { abbr: 'CVR', full: 'Cockpit Voice Recorder', explanation: 'Records crew communications and cockpit audio; required on transport category aircraft.' },
  { abbr: 'CWS', full: 'Central Warning System', explanation: 'Aircraft system that consolidates and displays crew warnings from multiple systems.' },
  { abbr: 'DAIWA', full: 'Damage Inspection and Airworthiness Assessment', explanation: 'Process for evaluating lightning strike or impact damage.' },
  { abbr: 'DAS', full: 'Data Acquisition System', explanation: 'System that records aircraft operational data for monitoring and analysis.' },
  { abbr: 'DER', full: 'Designated Engineering Representative', explanation: 'FAA-authorized engineer who can approve major repairs or alterations.' },
  { abbr: 'DME', full: 'Distance Measuring Equipment', explanation: 'Radio navigation system providing slant-range distance to a ground station.' },
  { abbr: 'EASA', full: 'European Union Aviation Safety Agency', explanation: 'European counterpart to the FAA; regulates aviation in EU member states.' },
  { abbr: 'ECAM', full: 'Electronic Centralized Aircraft Monitor', explanation: 'Airbus system displaying aircraft system status and failure information.' },
  { abbr: 'ECU', full: 'Engine Control Unit', explanation: 'Electronic unit controlling engine fuel delivery and performance parameters.' },
  { abbr: 'EICAS', full: 'Engine Indicating and Crew Alerting System', explanation: 'Boeing/general term for engine monitoring and crew warning display.' },
  { abbr: 'ELT', full: 'Emergency Locator Transmitter', explanation: 'Automatic distress beacon activated by crash impact or manually by crew.' },
  { abbr: 'EMI', full: 'Electromagnetic Interference', explanation: 'Unwanted electromagnetic energy that can disrupt aircraft systems.' },
  { abbr: 'EMP', full: 'Electromagnetic Pulse', explanation: 'Intense burst of electromagnetic energy that can damage aircraft electronics.' },
  { abbr: 'ETOPS', full: 'Extended-range Twin-engine Operational Performance Standards', explanation: 'FAA/ICAO rules for twin-engine over-water operations.' },
  { abbr: 'EWIS', full: 'Electrical Wiring Interconnection System', explanation: 'All aircraft wiring, connectors, and associated components per FAR 25.1701.' },
  { abbr: 'FAA', full: 'Federal Aviation Administration', explanation: 'U.S. government agency responsible for civil aviation regulation and safety.' },
  { abbr: 'FADEC', full: 'Full Authority Digital Engine Control', explanation: 'Computer system providing complete electronic control of engine parameters.' },
  { abbr: 'FAR', full: 'Federal Aviation Regulation', explanation: 'U.S. aviation regulations codified in Title 14 of the Code of Federal Regulations.' },
  { abbr: 'FBO', full: 'Fixed Base Operator', explanation: 'Airport-based business providing fuel, maintenance, hangar, and other aviation services.' },
  { abbr: 'FDM', full: 'Flight Data Monitoring', explanation: 'Program analyzing flight data to identify operational safety trends.' },
  { abbr: 'FDR', full: 'Flight Data Recorder', explanation: '"Black box" that records flight parameters; required on transport category aircraft.' },
  { abbr: 'FIM', full: 'Fault Isolation Manual', explanation: 'Maintenance manual used to diagnose system faults using structured troubleshooting.' },
  { abbr: 'FMEA', full: 'Failure Mode and Effects Analysis', explanation: 'Engineering analysis identifying potential failures and their safety impact.' },
  { abbr: 'FMS', full: 'Flight Management System', explanation: 'Onboard computer integrating navigation, performance, and guidance functions.' },
  { abbr: 'FOD', full: 'Foreign Object Damage/Debris', explanation: 'Damage to aircraft or engine caused by foreign objects; also refers to the objects themselves.' },
  { abbr: 'FSDO', full: 'Flight Standards District Office', explanation: 'FAA regional office overseeing aviation safety and certification activities.' },
  { abbr: 'GCU', full: 'Generator Control Unit', explanation: 'Regulates aircraft generator output and protects electrical system from faults.' },
  { abbr: 'GPS', full: 'Global Positioning System', explanation: 'Satellite-based navigation system providing position, velocity, and time data.' },
  { abbr: 'GPWS', full: 'Ground Proximity Warning System', explanation: 'System that warns crew of unsafe proximity to terrain.' },
  { abbr: 'HF', full: 'High Frequency', explanation: 'Radio range (3-30 MHz) used for long-range aviation communications.' },
  { abbr: 'HIRF', full: 'High Intensity Radiated Fields', explanation: 'Electromagnetic environment that can interfere with aircraft systems; design standard per FAR 25.1317.' },
  { abbr: 'HMDB', full: 'Hazardous Material Data Base', explanation: 'Database of hazardous materials and handling requirements.' },
  { abbr: 'HSI', full: 'Horizontal Situation Indicator', explanation: 'Flight instrument combining heading, course, and navigation information.' },
  { abbr: 'HUD', full: 'Head-Up Display', explanation: "Transparent display projecting flight data into the pilot's forward field of view." },
  { abbr: 'ICA', full: 'Instructions for Continued Airworthiness', explanation: "Manufacturer's maintenance requirements mandated by FAR 21 for TC holders." },
  { abbr: 'ICAO', full: 'International Civil Aviation Organization', explanation: 'UN specialized agency setting international aviation standards.' },
  { abbr: 'IFR', full: 'Instrument Flight Rules', explanation: 'FAA regulations governing flight in IMC; also refers to a flight plan filed under those rules.' },
  { abbr: 'IGV', full: 'Inlet Guide Vane', explanation: 'Variable vane at engine compressor inlet controlling airflow direction.' },
  { abbr: 'IMC', full: 'Instrument Meteorological Conditions', explanation: 'Weather conditions below VFR minimums requiring instrument flight.' },
  { abbr: 'INS', full: 'Inertial Navigation System', explanation: 'Self-contained navigation using accelerometers and gyroscopes; no external signals needed.' },
  { abbr: 'IPC', full: 'Illustrated Parts Catalog', explanation: 'Manual providing part numbers and exploded diagrams for aircraft components.' },
  { abbr: 'IRS', full: 'Inertial Reference System', explanation: 'Modern INS using laser ring gyros; provides attitude, heading, and position data.' },
  { abbr: 'LRU', full: 'Line Replaceable Unit', explanation: 'Component designed for quick removal and replacement at the line maintenance level.' },
  { abbr: 'MALSR', full: 'Medium Intensity Approach Lighting System with Runway Alignment Indicator Lights', explanation: 'Airport approach lighting system.' },
  { abbr: 'MEL', full: 'Minimum Equipment List', explanation: 'Approved list of equipment that may be inoperative for dispatch under specific conditions.' },
  { abbr: 'MFD', full: 'Multi-Function Display', explanation: 'Configurable cockpit display showing navigation, system, and weather data.' },
  { abbr: 'MMEL', full: 'Master Minimum Equipment List', explanation: 'FAA-approved master list from which operators develop their aircraft-specific MEL.' },
  { abbr: 'MOC', full: 'Means of Compliance', explanation: 'Acceptable method for meeting a regulatory or certification requirement.' },
  { abbr: 'MRB', full: 'Maintenance Review Board', explanation: 'Industry-FAA body that establishes initial scheduled maintenance requirements for new aircraft types.' },
  { abbr: 'MRBR', full: 'Maintenance Review Board Report', explanation: 'Document establishing initial maintenance program requirements for a new aircraft type.' },
  { abbr: 'MRO', full: 'Maintenance, Repair & Overhaul', explanation: 'Organization or activity performing aircraft maintenance work; also the industry term.' },
  { abbr: 'MSB', full: 'Mandatory Service Bulletin', explanation: 'Service bulletin issued by a manufacturer that must be complied with (often tied to an AD).' },
  { abbr: 'MSG-3', full: 'Maintenance Steering Group 3', explanation: 'Analytical process used to develop efficient scheduled maintenance programs.' },
  { abbr: 'MSN', full: 'Manufacturer Serial Number', explanation: 'Unique serial number assigned to an aircraft at production.' },
  { abbr: 'NDI', full: 'Non-Destructive Inspection', explanation: 'Synonym for NDT; used interchangeably in maintenance documentation.' },
  { abbr: 'NDT', full: 'Non-Destructive Testing', explanation: "Inspection methods (dye penetrant, ultrasonic, eddy current, X-ray) that don't damage the part." },
  { abbr: 'NOTAM', full: 'Notice to Airmen', explanation: 'Official notice containing information essential to flight operations.' },
  { abbr: 'OAT', full: 'Outside Air Temperature', explanation: 'Ambient air temperature measured outside the aircraft.' },
  { abbr: 'OEM', full: 'Original Equipment Manufacturer', explanation: 'The original manufacturer of an aircraft, engine, or component.' },
  { abbr: 'OHC', full: 'Overhaul Check', explanation: 'Scheduled heavy maintenance event restoring components to serviceable limits.' },
  { abbr: 'PAR', full: 'Precision Approach Radar', explanation: 'Ground-based radar system providing guidance to landing aircraft.' },
  { abbr: 'PAX', full: 'Passengers', explanation: 'Standard abbreviation for aircraft passengers in maintenance and ops documentation.' },
  { abbr: 'PFD', full: 'Primary Flight Display', explanation: 'Main cockpit display showing attitude, airspeed, altitude, and heading.' },
  { abbr: 'PMA', full: 'Parts Manufacturer Approval', explanation: 'FAA approval allowing a manufacturer other than the OEM to produce replacement parts.' },
  { abbr: 'QEC', full: 'Quick Engine Change', explanation: 'Kit and procedure for rapid engine replacement using pre-assembled components.' },
  { abbr: 'QRH', full: 'Quick Reference Handbook', explanation: 'Pilot reference for abnormal and emergency procedures.' },
  { abbr: 'R&R', full: 'Removal and Replacement', explanation: 'Common maintenance shorthand for removing and installing a component.' },
  { abbr: 'RII', full: 'Required Inspection Item', explanation: 'Maintenance task that must be inspected by a second, independent certificated person.' },
  { abbr: 'RVSM', full: 'Reduced Vertical Separation Minimum', explanation: 'Airspace where aircraft maintain 1,000 ft separation between FL290-FL410.' },
  { abbr: 'SAF', full: 'Safety Management System', explanation: 'Systematic approach to managing safety risk in aviation organizations.' },
  { abbr: 'SATCOM', full: 'Satellite Communications', explanation: 'Aircraft communication system using satellite links for voice and data.' },
  { abbr: 'SB', full: 'Service Bulletin', explanation: 'Manufacturer-issued maintenance instructions; may be mandatory (via AD) or optional.' },
  { abbr: 'SI', full: 'Service Instruction', explanation: "Lycoming's term for manufacturer maintenance guidance (equivalent to SB for other manufacturers)." },
  { abbr: 'SL', full: 'Service Letter', explanation: 'Manufacturer communication providing maintenance information or recommendations; typically less urgent than SBs.' },
  { abbr: 'SMS', full: 'Safety Management System', explanation: 'Organizational framework for managing aviation safety risks and promoting safety culture.' },
  { abbr: 'SOC', full: 'Statement of Compliance', explanation: 'Document certifying that a product or procedure meets specified requirements.' },
  { abbr: 'SPM', full: 'Standard Practices Manual', explanation: 'Manual covering general maintenance practices applicable across aircraft types.' },
  { abbr: 'SRM', full: 'Structural Repair Manual', explanation: 'Manual providing approved methods for repairing aircraft structure.' },
  { abbr: 'SSB', full: 'Single Sideband', explanation: 'Radio transmission mode used in HF communications for long-range voice.' },
  { abbr: 'STC', full: 'Supplemental Type Certificate', explanation: 'FAA approval for a modification or alteration to a type-certificated product.' },
  { abbr: 'TAWS', full: 'Terrain Awareness and Warning System', explanation: 'Enhanced GPWS providing forward-looking terrain avoidance.' },
  { abbr: 'TBO', full: 'Time Between Overhaul', explanation: 'Manufacturer-recommended interval between engine or component overhauls (not always mandatory for Part 91).' },
  { abbr: 'TCAS', full: 'Traffic Collision Avoidance System', explanation: 'Onboard system providing traffic advisories and collision avoidance.' },
  { abbr: 'TCDS', full: 'Type Certificate Data Sheet', explanation: 'FAA document listing the approved configuration and limitations of a type-certificated aircraft.' },
  { abbr: 'TOLD', full: 'Takeoff and Landing Data', explanation: 'Calculated performance data for specific runway/weight/atmospheric conditions.' },
  { abbr: 'TSN', full: 'Time Since New', explanation: 'Total operating hours or cycles since a component was manufactured.' },
  { abbr: 'TSO', full: 'Technical Standard Order / Time Since Overhaul', explanation: 'FAA minimum performance standard for specified avionics and equipment. Also used for Time Since Overhaul (context-dependent).' },
  { abbr: 'UHF', full: 'Ultra High Frequency', explanation: 'Radio range (300 MHz - 3 GHz); used for military aviation and some navigation aids.' },
  { abbr: 'VFR', full: 'Visual Flight Rules', explanation: 'FAA regulations governing flight in VMC; pilots navigate by visual reference.' },
  { abbr: 'VHF', full: 'Very High Frequency', explanation: 'Radio frequency range (30-300 MHz) used for aviation voice communications.' },
  { abbr: 'VMC', full: 'Visual Meteorological Conditions', explanation: 'Weather conditions meeting VFR minimums; flight by visual reference.' },
  { abbr: 'VMO', full: 'Maximum Operating Speed', explanation: 'Maximum allowable indicated airspeed in level flight.' },
  { abbr: 'WDM', full: 'Wiring Diagram Manual', explanation: 'Manual containing complete aircraft wiring schematics and wire routing data.' },
  { abbr: 'WO', full: 'Work Order', explanation: 'Document authorizing and tracking maintenance work performed on an aircraft or component.' },
  { abbr: 'ZFW', full: 'Zero Fuel Weight', explanation: 'Maximum allowable weight of an aircraft without usable fuel; structural design limit.' },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function AviationAbbreviationsClient() {
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ABBREVIATIONS.filter(item => {
      const matchesSearch = !q ||
        item.abbr.toLowerCase().includes(q) ||
        item.full.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q)
      const matchesLetter = !activeLetter || item.abbr.toUpperCase().startsWith(activeLetter)
      return matchesSearch && matchesLetter
    })
  }, [search, activeLetter])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Aviation Maintenance Abbreviations &amp; Acronyms</h1>
        <p className="text-slate-400">Searchable A–Z reference of 130+ aviation maintenance abbreviations and acronyms.</p>
      </div>

      {/* Search */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 mb-4">
        <input
          type="text"
          placeholder="Search abbreviations, names, or descriptions..."
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveLetter(null) }}
          className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
        />
      </div>

      {/* Letter Filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <button
          onClick={() => setActiveLetter(null)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${!activeLetter ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#1e293b] text-slate-400 border border-slate-700 hover:border-slate-500'}`}
        >
          All
        </button>
        {ALPHABET.map(letter => (
          <button
            key={letter}
            onClick={() => { setActiveLetter(activeLetter === letter ? null : letter); setSearch('') }}
            className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${activeLetter === letter ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#1e293b] text-slate-400 border border-slate-700 hover:border-slate-500'}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-[#0f172a]">
                <th className="text-left text-slate-400 font-medium py-3 px-4 w-28">Abbreviation</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4 w-64">Full Name</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-[#38bdf8]">{item.abbr}</span>
                  </td>
                  <td className="py-3 px-4 text-white">{item.full}</td>
                  <td className="py-3 px-4 text-slate-400">{item.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No abbreviations match your search.</div>
        )}
      </div>
    </div>
  )
}
