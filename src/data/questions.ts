export interface Question {
  id: string
  exam: 'general' | 'airframe' | 'powerplant'
  topic: string
  question: string
  options: { A: string; B: string; C: string; D: string }
  correct: 'A' | 'B' | 'C' | 'D'
  explanation: string
  reference?: string
}

export const questions: Question[] = [
  // ─── GENERAL (20) ───────────────────────────────────────────────────────────
  {
    id: 'GEN-001',
    exam: 'general',
    topic: 'weight-balance',
    question: 'When computing weight and balance, an item located aft of the datum has a',
    options: {
      A: 'positive arm and positive moment',
      B: 'negative arm and positive moment',
      C: 'positive arm and negative moment',
      D: 'negative arm and negative moment',
    },
    correct: 'A',
    explanation:
      'The datum is the reference point from which all arm measurements are made. Items located AFT of the datum have a positive arm (positive distance from datum). Moment = Weight × Arm, so a positive weight times a positive arm = positive moment. Items forward of the datum have a negative arm.',
    reference: 'AC 43.13-1B, Weight and Balance',
  },
  {
    id: 'GEN-002',
    exam: 'general',
    topic: 'regulations',
    question: 'An A&P mechanic may perform major repairs on a certificated aircraft under which condition?',
    options: {
      A: 'Only if supervised by a certificated repairman',
      B: 'Only after obtaining an FAA Form 337 approval',
      C: 'If the work is done in accordance with approved data and the mechanic holds appropriate ratings',
      D: 'Only at a certificated repair station',
    },
    correct: 'C',
    explanation:
      'Under 14 CFR Part 65.81, a certificated A&P mechanic may perform and approve maintenance, preventive maintenance, and alterations on aircraft they are rated for, provided it is done in accordance with FAA-approved data. No supervision or Form 337 is required for standard repairs.',
    reference: '14 CFR 65.81',
  },
  {
    id: 'GEN-003',
    exam: 'general',
    topic: 'fluid-lines',
    question: 'AN fluid line fittings are identified by their',
    options: {
      A: 'thread pitch and outside diameter',
      B: 'dash number which indicates tube outside diameter in 16ths of an inch',
      C: 'color coding and material composition',
      D: 'dash number which indicates tube outside diameter in 32nds of an inch',
    },
    correct: 'B',
    explanation:
      'AN (Air Force-Navy) fitting dash numbers indicate the tube outside diameter in 1/16-inch increments. For example, AN-4 indicates a tube with 4/16 (1/4) inch outside diameter. This is the standard identification system used throughout aviation plumbing.',
    reference: 'AC 43.13-1B, Chapter 9',
  },
  {
    id: 'GEN-004',
    exam: 'general',
    topic: 'math-physics',
    question: 'The area of a circle with a diameter of 6 inches is approximately',
    options: {
      A: '18.85 in²',
      B: '28.27 in²',
      C: '37.70 in²',
      D: '113.1 in²',
    },
    correct: 'B',
    explanation:
      'Area = π × r² = π × (3)² = π × 9 ≈ 28.27 in². The radius is half the diameter: 6/2 = 3 inches. This formula is critical for hydraulic piston area calculations and fuel tank volume calculations.',
  },
  {
    id: 'GEN-005',
    exam: 'general',
    topic: 'publications',
    question: 'Airworthiness Directives (ADs) are legally enforceable regulations issued under',
    options: {
      A: '14 CFR Part 39',
      B: '14 CFR Part 43',
      C: '14 CFR Part 65',
      D: '14 CFR Part 91',
    },
    correct: 'A',
    explanation:
      'Airworthiness Directives are issued under 14 CFR Part 39, which gives the FAA authority to define and enforce airworthiness standards. Part 43 covers maintenance, Part 65 covers mechanic certification, and Part 91 covers operating rules.',
    reference: '14 CFR Part 39',
  },
  {
    id: 'GEN-006',
    exam: 'general',
    topic: 'ground-ops',
    question: 'When taxiing an aircraft with a crosswind from the left, the ailerons should be positioned',
    options: {
      A: 'neutral — ailerons don\'t affect taxiing',
      B: 'left aileron up, right aileron down (into the wind)',
      C: 'left aileron down, right aileron up (away from wind)',
      D: 'both ailerons neutral with rudder into the wind',
    },
    correct: 'B',
    explanation:
      'When taxiing with a headwind component from the left (quartering headwind), turn the control wheel INTO the wind — left aileron up. This raises the upwind (left) wing\'s aileron, which reduces the wind\'s ability to lift that wing. The opposite applies for a tailwind — control away from the wind.',
  },
  {
    id: 'GEN-007',
    exam: 'general',
    topic: 'weight-balance',
    question:
      'The CG of an aircraft is found to be at 35.5 inches aft of the datum. The forward CG limit is 32.0 inches and the aft CG limit is 37.0 inches. The aircraft is',
    options: {
      A: 'within CG limits',
      B: 'forward of the CG envelope',
      C: 'aft of the CG envelope',
      D: 'at the aft CG limit',
    },
    correct: 'A',
    explanation:
      'The CG at 35.5 inches falls between the forward limit (32.0 inches) and aft limit (37.0 inches), so the aircraft is within CG limits. If the CG were aft of 37.0 inches or forward of 32.0 inches, the aircraft would be out of limits.',
  },
  {
    id: 'GEN-008',
    exam: 'general',
    topic: 'math-physics',
    question: 'A force of 500 pounds is applied over an area of 20 square inches. The resulting pressure is',
    options: {
      A: '10,000 PSI',
      B: '25 PSI',
      C: '500 PSI',
      D: '250 PSI',
    },
    correct: 'B',
    explanation:
      'Pressure = Force / Area = 500 lbs / 20 in² = 25 PSI. This is Pascal\'s Law applied to hydraulic systems. Always divide force by area to find pressure — not the other way around.',
  },
  {
    id: 'GEN-009',
    exam: 'general',
    topic: 'fluid-lines',
    question: 'Rigid aircraft tubing should be supported at intervals not to exceed',
    options: {
      A: '12 inches for 1/4-inch tube',
      B: '24 inches regardless of tube size',
      C: 'per the manufacturer\'s maintenance manual specifications',
      D: '6 inches for all sizes',
    },
    correct: 'C',
    explanation:
      'While AC 43.13-1B provides general guidance on tubing support spacing, the binding requirement is always the aircraft manufacturer\'s approved maintenance manual (AMM). Support intervals vary by tube material, diameter, and location. Always consult approved data.',
    reference: 'AC 43.13-1B, Chapter 9',
  },
  {
    id: 'GEN-010',
    exam: 'general',
    topic: 'regulations',
    question: 'A certificated mechanic who performs an annual inspection must hold',
    options: {
      A: 'an Airframe and Powerplant certificate',
      B: 'an Inspection Authorization (IA)',
      C: 'a Repairman certificate',
      D: 'an A&P certificate plus 3 years of experience',
    },
    correct: 'B',
    explanation:
      'Annual inspections may only be performed by holders of an Inspection Authorization (IA) per 14 CFR 65.95. An IA is a separate authorization issued to eligible A&P mechanics — an A&P certificate alone does not authorize annual inspections.',
    reference: '14 CFR 65.95',
  },
  {
    id: 'GEN-011',
    exam: 'general',
    topic: 'publications',
    question: 'An aircraft manufacturer\'s service bulletin is',
    options: {
      A: 'always mandatory and must be complied with immediately',
      B: 'optional unless incorporated into an Airworthiness Directive',
      C: 'mandatory for Part 121 operators only',
      D: 'required within 90 days of issuance',
    },
    correct: 'B',
    explanation:
      'A manufacturer\'s Service Bulletin (SB) is a recommendation, not a regulatory requirement. However, if the FAA issues an Airworthiness Directive that references or mandates compliance with an SB, it then becomes legally required. Always check whether an AD has been issued for a given SB.',
  },
  {
    id: 'GEN-012',
    exam: 'general',
    topic: 'math-physics',
    question:
      'The specific gravity of aviation 100LL fuel is approximately 0.72. If a fuel tank contains 50 gallons, the weight of the fuel is approximately',
    options: {
      A: '300 lbs',
      B: '360 lbs',
      C: '417 lbs',
      D: '432 lbs',
    },
    correct: 'A',
    explanation:
      'Water weighs 8.34 lbs/gallon. Specific gravity × water weight × gallons = fuel weight. 0.72 × 8.34 × 50 ≈ 300 lbs. A useful rule of thumb: 100LL avgas weighs approximately 6.0 lbs/gallon (6.0 × 50 = 300 lbs).',
  },
  {
    id: 'GEN-013',
    exam: 'general',
    topic: 'ground-ops',
    question: 'During engine runup, if an aircraft experiences an engine anomaly (unusual surge or roughness), the immediate action is',
    options: {
      A: 'advance both throttles to full power to maintain control',
      B: 'reduce throttle and taxi back for maintenance inspection',
      C: 'shut down the affected engine immediately',
      D: 'continue the runup and note it in the logbook',
    },
    correct: 'B',
    explanation:
      'If an engine anomaly is observed during runup, the correct action is to reduce power and return the aircraft for maintenance inspection. Continuing the runup or flight with a known engine discrepancy is hazardous and may be a regulatory violation.',
  },
  {
    id: 'GEN-014',
    exam: 'general',
    topic: 'weight-balance',
    question: 'Adding equipment aft of the current CG will cause the CG to',
    options: {
      A: 'move forward',
      B: 'move aft',
      C: 'remain unchanged',
      D: 'shift laterally',
    },
    correct: 'B',
    explanation:
      'Adding weight behind the current CG position generates a moment that rotates the balance point aft. The new CG = (old total moment + new item moment) / new total weight. Any weight added aft of the CG moves the CG aft; weight added forward of the CG moves it forward.',
  },
  {
    id: 'GEN-015',
    exam: 'general',
    topic: 'regulations',
    question: 'Which document must be used as the basis for a major repair or alteration on a type-certificated aircraft?',
    options: {
      A: 'The latest service bulletin from the manufacturer',
      B: 'FAA-approved data, which may include the manufacturer\'s AMM, SRM, or an approved DER data sheet',
      C: 'AC 43.13-1B alone is sufficient for all major repairs',
      D: 'Any FAA-approved repair station\'s standard practices',
    },
    correct: 'B',
    explanation:
      'Major repairs and alterations must be accomplished using FAA-approved data per 14 CFR 43.13(b). This includes manufacturer\'s approved maintenance manuals, structural repair manuals, DER-approved data, or ADs. AC 43.13-1B is acceptable data for repairs not covered by the manufacturer\'s AMM, but it is not the only option.',
    reference: '14 CFR 43.13(b)',
  },
  {
    id: 'GEN-016',
    exam: 'general',
    topic: 'math-physics',
    question:
      'A work order requires torquing a bolt to 150 in-lb. The mechanic\'s torque wrench is 10 inches long and a 4-inch extension is being used. What should the wrench be set to?',
    options: {
      A: '150 in-lb',
      B: '107 in-lb',
      C: '214 in-lb',
      D: '120 in-lb',
    },
    correct: 'B',
    explanation:
      'Use the extension formula: TW = (T × L) / (L + E) = (150 × 10) / (10 + 4) = 1500 / 14 ≈ 107 in-lb. When a rigid inline extension is used, the effective lever arm increases, so the wrench setting must be reduced to deliver the correct torque at the fastener.',
  },
  {
    id: 'GEN-017',
    exam: 'general',
    topic: 'fluid-lines',
    question: 'Which type of aircraft hose is used for fuel, oil, and coolant lines where some flexing is required?',
    options: {
      A: 'Teflon (PTFE) hose',
      B: 'MIL-H-6000 rubber hose',
      C: 'Polyethylene tubing',
      D: 'Aluminum alloy rigid tubing',
    },
    correct: 'B',
    explanation:
      'MIL-H-6000 rubber hose is the standard flexible hose for fuel, oil, and coolant applications. Teflon hose is used for high-temperature applications. Aluminum tubing is rigid and not suitable where flexing is required. Polyethylene is not an approved aircraft plumbing material.',
  },
  {
    id: 'GEN-018',
    exam: 'general',
    topic: 'publications',
    question: 'Where would a mechanic find the approved procedures for a 100-hour inspection on a specific aircraft?',
    options: {
      A: 'AC 43.13-1B only',
      B: 'The aircraft manufacturer\'s approved Maintenance Manual or Inspection Program',
      C: 'The FAA Mechanic\'s Handbook',
      D: 'Any current aviation textbook',
    },
    correct: 'B',
    explanation:
      'The aircraft manufacturer\'s approved Maintenance Manual or Continuous Airworthiness Maintenance Program (CAMP) defines the specific inspection items, intervals, and procedures for that aircraft. AC 43.13-1B provides acceptable methods for repairs but does not define inspection programs for specific aircraft.',
  },
  {
    id: 'GEN-019',
    exam: 'general',
    topic: 'ground-ops',
    question: 'Aircraft position lights are required to be on during',
    options: {
      A: 'daytime operations only',
      B: 'all operations, day and night',
      C: 'night operations only',
      D: 'IFR operations only',
    },
    correct: 'C',
    explanation:
      'Under 14 CFR 91.209, aircraft must display position (navigation) lights from sunset to sunrise. Anticollision lights are required unless the pilot determines it would be inadvisable. Position lights are not required during daytime VFR operations.',
    reference: '14 CFR 91.209',
  },
  {
    id: 'GEN-020',
    exam: 'general',
    topic: 'math-physics',
    question: 'A rectangular fuel tank measures 24 inches long, 12 inches wide, and 8 inches deep. Its capacity in gallons is approximately',
    options: {
      A: '6.2 gallons',
      B: '8.3 gallons',
      C: '10.0 gallons',
      D: '16.6 gallons',
    },
    correct: 'C',
    explanation:
      'Volume = L × W × H = 24 × 12 × 8 = 2,304 cubic inches. 1 gallon = 231 cubic inches. 2,304 / 231 ≈ 9.97 gallons ≈ 10.0 gallons. For exam purposes: memorize 231 in³/gallon as a key constant.',
  },

  // ─── AIRFRAME (20) ──────────────────────────────────────────────────────────
  {
    id: 'AME-001',
    exam: 'airframe',
    topic: 'sheet-metal',
    question: 'The recommended rivet diameter for joining sheets of 0.040-inch aluminum is',
    options: {
      A: '1/16 inch',
      B: '3/32 inch',
      C: '1/8 inch',
      D: '5/32 inch',
    },
    correct: 'C',
    explanation:
      'The rule of thumb for rivet diameter selection is 3 times the thickness of the thickest sheet. 0.040 × 3 = 0.120 inches. The nearest standard rivet diameter is 1/8 inch (0.125 inch). This ensures proper shear strength and prevents the rivet from pulling through the sheet.',
    reference: 'AC 43.13-1B, Chapter 4',
  },
  {
    id: 'AME-002',
    exam: 'airframe',
    topic: 'hydraulics',
    question: 'In an aircraft hydraulic system, a pressure relief valve is installed to',
    options: {
      A: 'maintain system pressure at a constant level during flight',
      B: 'protect the system from overpressure caused by thermal expansion or pump output',
      C: 'allow the pilot to manually release hydraulic pressure',
      D: 'prevent hydraulic fluid from returning to the reservoir',
    },
    correct: 'B',
    explanation:
      'A hydraulic pressure relief valve is a safety device that opens when system pressure exceeds the preset maximum, allowing fluid to return to the reservoir. This prevents damage from pump overpressure or thermal expansion of trapped fluid. It is NOT a normal pressure regulator.',
  },
  {
    id: 'AME-003',
    exam: 'airframe',
    topic: 'structures',
    question: 'A stressed-skin aircraft structure derives its strength primarily from',
    options: {
      A: 'a heavy internal framework of spars and formers',
      B: 'the skin itself, which carries both shear and tension loads',
      C: 'external bracing wires and struts',
      D: 'thick aluminum extrusions running the length of the fuselage',
    },
    correct: 'B',
    explanation:
      'In a monocoque or semi-monocoque (stressed-skin) structure, the outer skin is a primary structural member that carries shear, tension, and compression loads. This contrasts with truss structures, where the skin is non-structural. Modern aircraft are semi-monocoque — the skin works together with internal frames, stringers, and bulkheads.',
  },
  {
    id: 'AME-004',
    exam: 'airframe',
    topic: 'sheet-metal',
    question: 'Minimum edge distance for a rivet is',
    options: {
      A: '1.5 times the rivet diameter',
      B: '2 times the rivet diameter',
      C: '3 times the rivet diameter',
      D: 'equal to the rivet diameter',
    },
    correct: 'B',
    explanation:
      'The minimum edge distance (distance from the center of the rivet to the edge of the material) is 2 times the rivet diameter per AC 43.13-1B. The recommended edge distance is 2.5D. Going below 2D risks the material tearing through from the rivet to the edge.',
    reference: 'AC 43.13-1B, Chapter 4',
  },
  {
    id: 'AME-005',
    exam: 'airframe',
    topic: 'electrical',
    question: 'In aircraft DC electrical systems, the purpose of a circuit breaker is to',
    options: {
      A: 'automatically increase voltage when current demand rises',
      B: 'protect the wiring from overheating due to excessive current',
      C: 'reduce electromagnetic interference in the circuit',
      D: 'maintain constant current regardless of load changes',
    },
    correct: 'B',
    explanation:
      'Circuit breakers (CBs) are overcurrent protection devices that open the circuit when current exceeds their rated value, protecting the wire from overheating and potential fire. Unlike fuses, most aircraft CBs can be reset in flight. They protect the WIRE, not necessarily the equipment.',
  },
  {
    id: 'AME-006',
    exam: 'airframe',
    topic: 'landing-gear',
    question: 'A shimmy damper on the nose landing gear is installed to',
    options: {
      A: 'absorb vertical shock loads during landing',
      B: 'prevent oscillatory steering movements (shimmy) during taxi and rollout',
      C: 'increase steering sensitivity at low speeds',
      D: 'lock the nosewheel for crosswind landings',
    },
    correct: 'B',
    explanation:
      'Shimmy is a rapid, oscillatory movement of the nose gear that can cause structural damage and loss of directional control. A shimmy damper (typically a hydraulic snubber) prevents this by resisting the rapid side-to-side motion while still allowing normal steering deflection.',
  },
  {
    id: 'AME-007',
    exam: 'airframe',
    topic: 'welding',
    question: 'The type of weld used to join two pieces of metal end-to-end in a straight line is called a',
    options: {
      A: 'fillet weld',
      B: 'plug weld',
      C: 'butt weld',
      D: 'lap weld',
    },
    correct: 'C',
    explanation:
      'A butt weld joins two pieces end-to-end with the weld bead filling the joint gap. A fillet weld joins two pieces at an angle (like a T-joint or corner joint). A lap weld overlaps two pieces. A plug weld fills a hole drilled through one piece into another.',
  },
  {
    id: 'AME-008',
    exam: 'airframe',
    topic: 'fuel-systems',
    question: 'Aircraft fuel vents are required to prevent',
    options: {
      A: 'fuel from siphoning overboard in flight',
      B: 'fuel tank collapse or damage from pressure differential during descent',
      C: 'fuel contamination from atmospheric moisture',
      D: 'both A and B',
    },
    correct: 'D',
    explanation:
      'Fuel vents serve two critical functions: (1) preventing a vacuum from forming as fuel is consumed (which could collapse the tank or stop fuel flow), and (2) preventing excessive pressure buildup during climb. Vents are also designed to prevent fuel siphoning by orienting the vent outlet correctly.',
  },
  {
    id: 'AME-009',
    exam: 'airframe',
    topic: 'flight-controls',
    question: 'A balance tab moves in the _______ direction as the primary control surface.',
    options: {
      A: 'same',
      B: 'opposite',
      C: 'perpendicular',
      D: 'Balance tabs don\'t move relative to the control surface',
    },
    correct: 'B',
    explanation:
      'A balance tab moves in the opposite direction of the primary control surface. As the surface deflects down, the balance tab deflects up, creating an aerodynamic force that ASSISTS the pilot in moving the surface. This reduces the control force required. Anti-servo tabs move in the same direction, increasing force.',
  },
  {
    id: 'AME-010',
    exam: 'airframe',
    topic: 'hydraulics',
    question: 'Hydraulic fluid that appears milky or cloudy most likely indicates',
    options: {
      A: 'fluid overtemperature',
      B: 'water contamination',
      C: 'air entrainment in the system',
      D: 'chemical breakdown of the fluid additives',
    },
    correct: 'B',
    explanation:
      'Milky or cloudy hydraulic fluid is a classic indicator of water contamination. Water can enter through condensation, seal failure, or servicing. Water in hydraulic fluid causes corrosion, freezing at altitude, and degraded lubrication. The fluid should be drained, system flushed, and source of contamination identified.',
  },
  {
    id: 'AME-011',
    exam: 'airframe',
    topic: 'structures',
    question: 'A crack found in an aircraft skin that is located at a rivet hole is classified as',
    options: {
      A: 'negligible damage requiring no repair',
      B: 'a stress concentration requiring inspection and likely repair',
      C: 'acceptable if less than 1/4 inch long',
      D: 'acceptable if the rivet is replaced',
    },
    correct: 'B',
    explanation:
      'Cracks at rivet holes are stress concentrations and must be evaluated per the aircraft\'s Structural Repair Manual (SRM). Rivet holes are areas of high stress concentration, and cracks propagate rapidly from these points. The SRM defines whether the crack is repairable, requires a doubler patch, or requires part replacement.',
  },
  {
    id: 'AME-012',
    exam: 'airframe',
    topic: 'electrical',
    question: 'The correct wire gauge for a 28V DC circuit carrying 15 amps through 20 feet of wire with a 2% voltage drop limit is',
    options: {
      A: 'AWG 22',
      B: 'AWG 18',
      C: 'AWG 14',
      D: 'AWG 10',
    },
    correct: 'D',
    explanation:
      'Using the voltage drop formula: CM = (K × L × 2 × I) / (V × drop%) = (10.75 × 20 × 2 × 15) / (28 × 0.02) ≈ 11,518 CM. AWG 10 has approximately 10,380 CM — the closest standard gauge that satisfies this requirement. Always select wire that meets or exceeds the calculated circular mil requirement.',
    reference: 'AC 43.13-1B, Chapter 11',
  },
  {
    id: 'AME-013',
    exam: 'airframe',
    topic: 'welding',
    question: 'When inspecting an oxyacetylene weld on a steel aircraft tube, a good weld should appear',
    options: {
      A: 'with a rough, irregular surface indicating good penetration',
      B: 'smooth and even, with a width of approximately 2 times the wall thickness',
      C: 'flat and flush with the base metal surface',
      D: 'with visible porosity indicating proper gas coverage',
    },
    correct: 'B',
    explanation:
      'A good oxyacetylene weld on steel tubing should be smooth, uniform, and have a bead width of approximately 2× the wall thickness of the parent material. The weld should show good fusion at the edges (toes) with no undercut. Porosity, cracks, or excessive width are defects.',
  },
  {
    id: 'AME-014',
    exam: 'airframe',
    topic: 'landing-gear',
    question: 'A main landing gear that retracts toward the fuselage centerline is called',
    options: {
      A: 'inward retracting',
      B: 'aft retracting',
      C: 'forward retracting',
      D: 'tandem retracting',
    },
    correct: 'A',
    explanation:
      'Landing gear retraction direction is described by the direction the gear moves. Inward retracting gear folds toward the aircraft centerline into the wing or fuselage. Most light aircraft with retractable gear use inward retraction into the wing.',
  },
  {
    id: 'AME-015',
    exam: 'airframe',
    topic: 'sheet-metal',
    question: 'AN426 rivets should be used instead of AN470 rivets when',
    options: {
      A: 'higher shear strength is required',
      B: 'the work area is an aerodynamic surface requiring a flush finish',
      C: 'the material is thicker than 0.125 inches',
      D: 'the rivet is used in a tension application',
    },
    correct: 'B',
    explanation:
      'AN426 is a 100° countersunk (flush head) rivet used on aerodynamic surfaces where a protruding head would create drag. AN470 is a universal head rivet used where appearance and aerodynamics are less critical. AN426 requires countersinking or dimpling the skin.',
  },
  {
    id: 'AME-016',
    exam: 'airframe',
    topic: 'fuel-systems',
    question: 'Which type of aircraft fuel system component is used to prevent fuel from feeding from full tanks into an empty tank by gravity?',
    options: {
      A: 'fuel selector valve',
      B: 'check valve',
      C: 'boost pump',
      D: 'fuel strainer',
    },
    correct: 'B',
    explanation:
      'Check valves allow fuel flow in one direction only, preventing back-flow or cross-feed by gravity. In multi-tank systems, check valves prevent fuel from a full tank from feeding into a less-full tank through the fuel lines. They are spring-loaded or ball-type one-way valves.',
  },
  {
    id: 'AME-017',
    exam: 'airframe',
    topic: 'electrical',
    question: 'On a 28V aircraft electrical system, a circuit breaker rated at 5 amperes will open when current exceeds',
    options: {
      A: 'exactly 5 amperes immediately',
      B: '5 amperes continuously or a higher current for a shorter time',
      C: '2.5 amperes (50% of rated value)',
      D: '10 amperes (200% of rated value)',
    },
    correct: 'B',
    explanation:
      'Circuit breakers have a time-current characteristic — they will carry their rated current continuously without opening, but will trip faster at higher overcurrents. A 5A CB may carry 6-7A for several minutes before opening, or trip almost instantly at 20A. This is by design to prevent nuisance trips from momentary inrush currents.',
  },
  {
    id: 'AME-018',
    exam: 'airframe',
    topic: 'structures',
    question: 'Corrosion on aluminum aircraft skin that appears as white or gray powdery deposits on the surface is called',
    options: {
      A: 'intergranular corrosion',
      B: 'galvanic corrosion',
      C: 'surface (uniform) corrosion',
      D: 'fretting corrosion',
    },
    correct: 'C',
    explanation:
      'Surface or uniform corrosion on aluminum produces white or gray powdery aluminum oxide deposits. It is the most common and least severe form, typically treatable by cleaning and re-protecting the surface. Intergranular corrosion penetrates along grain boundaries and is more serious. Galvanic corrosion occurs at the junction of dissimilar metals.',
  },
  {
    id: 'AME-019',
    exam: 'airframe',
    topic: 'flight-controls',
    question: 'Trim tabs are used primarily to',
    options: {
      A: 'increase the effectiveness of the primary control surface',
      B: 'relieve the pilot of continuous control pressure to maintain a desired flight attitude',
      C: 'limit the travel of the primary control surface',
      D: 'provide aerodynamic balance for the control surface',
    },
    correct: 'B',
    explanation:
      'Trim tabs allow the pilot to zero out (trim out) the control force needed to maintain a particular flight attitude, reducing pilot fatigue. For example, in a nose-heavy condition, the elevator trim tab is adjusted to maintain level flight without continuous back pressure on the stick/yoke.',
  },
  {
    id: 'AME-020',
    exam: 'airframe',
    topic: 'hydraulics',
    question: 'A hydraulic accumulator in an aircraft system serves to',
    options: {
      A: 'filter hydraulic fluid before it reaches actuators',
      B: 'store pressurized fluid to assist the pump during peak demand',
      C: 'convert hydraulic pressure to mechanical motion',
      D: 'separate air from hydraulic fluid',
    },
    correct: 'B',
    explanation:
      'A hydraulic accumulator stores pressurized fluid (using a compressed gas pre-charge, typically nitrogen) to supplement the hydraulic pump during peak demand periods (such as simultaneous actuation of multiple systems). It also dampens pressure surges and can provide limited hydraulic power if the pump fails.',
  },

  // ─── POWERPLANT (20) ────────────────────────────────────────────────────────
  {
    id: 'PME-001',
    exam: 'powerplant',
    topic: 'recip-theory',
    question: 'In a four-stroke reciprocating engine, the power stroke occurs',
    options: {
      A: 'when the piston moves from BDC to TDC on compression',
      B: 'when the piston moves from TDC to BDC after ignition',
      C: 'when the exhaust valve opens and combustion gases escape',
      D: 'during both the intake and compression strokes',
    },
    correct: 'B',
    explanation:
      'The four strokes are: (1) Intake — piston moves down, intake valve open; (2) Compression — piston moves up, both valves closed; (3) Power — spark ignites fuel/air mixture, expanding gases push piston from TDC to BDC; (4) Exhaust — piston moves up, exhaust valve open. The power stroke is the only stroke that produces useful work.',
  },
  {
    id: 'PME-002',
    exam: 'powerplant',
    topic: 'turbine-theory',
    question: 'A turbofan engine differs from a turbojet engine primarily by',
    options: {
      A: 'using a gearbox to drive the compressor at a different speed than the turbine',
      B: 'having a large fan that provides bypass airflow, producing thrust more efficiently',
      C: 'burning fuel in the exhaust (afterburner) for additional thrust',
      D: 'using centrifugal rather than axial compressors',
    },
    correct: 'B',
    explanation:
      'A turbofan has a large-diameter fan at the front that moves a large mass of air around (bypassing) the engine core. This bypass air provides thrust without burning fuel, making the engine significantly more fuel-efficient than a turbojet. Modern commercial aircraft use high-bypass turbofans with bypass ratios of 8:1 to 12:1.',
  },
  {
    id: 'PME-003',
    exam: 'powerplant',
    topic: 'ignition',
    question: 'Aircraft magneto ignition systems are used instead of battery-powered ignition because',
    options: {
      A: 'magnetos produce higher voltage for better combustion',
      B: 'magnetos are self-contained and continue operating if the aircraft electrical system fails',
      C: 'magnetos are lighter than battery-powered systems',
      D: 'FAA regulations require magneto ignition on all certified aircraft',
    },
    correct: 'B',
    explanation:
      'Magnetos generate their own electricity using permanent magnets — they require no external power source. This is critical for safety: if the aircraft battery or alternator fails, the magnetos continue to provide ignition. Most aircraft have two magnetos (left and right) on each engine for redundancy.',
  },
  {
    id: 'PME-004',
    exam: 'powerplant',
    topic: 'fuel-metering',
    question: 'A float-type carburetor supplies the correct mixture by',
    options: {
      A: 'metering fuel electronically based on airflow sensor input',
      B: 'maintaining a constant fuel level in the float chamber and using a venturi to draw fuel into the airstream',
      C: 'injecting fuel directly into each cylinder\'s intake port',
      D: 'using an engine-driven fuel pump to maintain constant pressure',
    },
    correct: 'B',
    explanation:
      'A float carburetor uses a float to maintain a constant fuel level in the float bowl. As air flows through the venturi, reduced pressure draws fuel from the bowl through the main metering jet. The amount of fuel is proportional to airflow. Simple, reliable, but susceptible to icing and less precise than fuel injection.',
  },
  {
    id: 'PME-005',
    exam: 'powerplant',
    topic: 'propellers',
    question: 'Propeller blade angle is measured as the angle between',
    options: {
      A: 'the chord line of the blade and the plane of rotation',
      B: 'the leading edge and trailing edge of the blade',
      C: 'the blade tip and the engine crankshaft',
      D: 'the thrust axis and the relative wind',
    },
    correct: 'A',
    explanation:
      'Blade angle (pitch angle) is the angle between the blade chord line at a reference station (usually 75% radius) and the plane of rotation. A low pitch (small angle) is used for takeoff — the blade bites off small chunks of air at high RPM. A high pitch (larger angle) is used for cruise — each revolution moves the aircraft farther forward.',
  },
  {
    id: 'PME-006',
    exam: 'powerplant',
    topic: 'recip-theory',
    question: 'Detonation in a reciprocating engine is caused by',
    options: {
      A: 'the spark plugs firing too early (over-advanced timing)',
      B: 'uncontrolled, explosive ignition of the fuel-air mixture ahead of the flame front',
      C: 'using fuel with too high an octane rating',
      D: 'excessively rich fuel mixture causing incomplete combustion',
    },
    correct: 'B',
    explanation:
      'Detonation occurs when the fuel-air charge in the cylinder auto-ignites ahead of the normal flame front, causing multiple flame fronts to collide. The result is extreme cylinder pressure, heat, and characteristic \'knock.\' Causes include low-octane fuel, over-lean mixture, high manifold pressure, and high engine temperature.',
  },
  {
    id: 'PME-007',
    exam: 'powerplant',
    topic: 'turbine-theory',
    question: 'Which turbine engine section converts the kinetic energy of the high-velocity gas stream into mechanical energy to drive the compressor?',
    options: {
      A: 'Combustion section',
      B: 'Turbine section',
      C: 'Compressor section',
      D: 'Exhaust section',
    },
    correct: 'B',
    explanation:
      'The turbine section extracts energy from the high-temperature, high-velocity gas stream leaving the combustor. Turbine blades are shaped like airfoils — the gas causes them to rotate, driving the compressor and accessories. In a turbofan, additional turbine stages drive the fan. The remaining energy exits as exhaust thrust.',
  },
  {
    id: 'PME-008',
    exam: 'powerplant',
    topic: 'lubrication',
    question: 'The purpose of an oil temperature gauge on a reciprocating engine is to',
    options: {
      A: 'measure the temperature of oil in the sump',
      B: 'monitor oil temperature as an indicator of engine cooling and operating conditions',
      C: 'activate an automatic oil cooler bypass valve',
      D: 'indicate when an oil change is required',
    },
    correct: 'B',
    explanation:
      'Oil temperature is a critical engine health indicator. High oil temperature can indicate inadequate oil cooling, low oil level, blocked cooler, or an engine problem generating excess heat. Low oil temperature in flight indicates the oil cooler bypass may be stuck open. Most engines have a minimum oil temperature before full power application.',
  },
  {
    id: 'PME-009',
    exam: 'powerplant',
    topic: 'inspections',
    question: 'A differential compression test reading of 62/80 on one cylinder indicates',
    options: {
      A: 'the cylinder has failed and must be replaced immediately',
      B: 'the cylinder is within serviceable limits but warrants monitoring',
      C: 'a blown head gasket, requiring immediate engine removal',
      D: 'the cylinder is in excellent condition',
    },
    correct: 'B',
    explanation:
      'A 62/80 reading means 62 PSI was held with 80 PSI applied — the cylinder retains 77.5% of the test pressure. Most manufacturers specify a minimum of 60/80 for continued service. A 62/80 reading is marginal but within limits. The mechanic should note the reading, listen for the source of leakage, and monitor the cylinder at the next inspection.',
  },
  {
    id: 'PME-010',
    exam: 'powerplant',
    topic: 'fuel-metering',
    question: 'In a fuel-injected reciprocating engine, the fuel injection nozzle is typically located',
    options: {
      A: 'at the throttle body, upstream of the intake manifold',
      B: 'at each individual cylinder intake port',
      C: 'in the carburetor venturi',
      D: 'directly into the combustion chamber (direct injection)',
    },
    correct: 'B',
    explanation:
      'In most aircraft piston engine fuel injection systems (Continental, Lycoming), nozzles are installed at each cylinder\'s intake port, injecting fuel into the incoming air charge just before the intake valve. This is port injection, providing more precise metering than a carburetor and eliminating carburetor icing.',
  },
  {
    id: 'PME-011',
    exam: 'powerplant',
    topic: 'propellers',
    question: 'A fixed-pitch propeller is designed to operate most efficiently at',
    options: {
      A: 'all engine speeds equally',
      B: 'one specific combination of airspeed and RPM (design point)',
      C: 'maximum RPM only',
      D: 'low airspeed, high RPM conditions only',
    },
    correct: 'B',
    explanation:
      'A fixed-pitch propeller has a single blade angle, making it efficient at only one design point (a specific airspeed and RPM combination). It will be less efficient at lower airspeeds (takeoff) or higher airspeeds (cruise) — a compromise. Constant-speed propellers adjust blade angle to maintain optimal efficiency across a range of conditions.',
  },
  {
    id: 'PME-012',
    exam: 'powerplant',
    topic: 'recip-theory',
    question: 'Valve overlap in a reciprocating engine refers to',
    options: {
      A: 'the period when both intake and exhaust valves are simultaneously open',
      B: 'the mechanical interference between intake and exhaust valve springs',
      C: 'the overlap between adjacent cylinder power strokes',
      D: 'the time delay between spark plug firing and combustion pressure peak',
    },
    correct: 'A',
    explanation:
      'Valve overlap is the brief period at the end of the exhaust stroke and beginning of the intake stroke when both the intake and exhaust valves are slightly open simultaneously. This allows the outgoing exhaust gases to help scavenge the cylinder and draw in fresh charge. Excessive overlap can cause backfiring at idle.',
  },
  {
    id: 'PME-013',
    exam: 'powerplant',
    topic: 'turbine-theory',
    question: 'N1 on a turbofan engine refers to',
    options: {
      A: 'the rotational speed of the high-pressure compressor/turbine spool',
      B: 'the rotational speed of the low-pressure compressor (fan) spool',
      C: 'the total thrust output as a percentage of rated thrust',
      D: 'the first-stage turbine inlet temperature',
    },
    correct: 'B',
    explanation:
      'On a two-spool turbofan, N1 is the rotational speed of the low-pressure (LP) spool, which includes the fan, LP compressor, and LP turbine. N2 is the high-pressure (HP) spool speed. N1 is typically expressed as a percentage of maximum rated speed and is the primary power setting reference for most turbofan-powered transport aircraft.',
  },
  {
    id: 'PME-014',
    exam: 'powerplant',
    topic: 'ignition',
    question: 'Magneto timing refers to',
    options: {
      A: 'the time it takes for the magneto to reach full output after engine start',
      B: 'the position of the engine crankshaft (degrees before TDC) when the magneto fires the spark plug',
      C: 'the interval between scheduled magneto inspections',
      D: 'the number of spark plug firings per minute',
    },
    correct: 'B',
    explanation:
      'Magneto timing (ignition timing) is the crankshaft position (in degrees before top dead center) at which the magneto generates a spark. Correct timing allows maximum cylinder pressure to develop just after the piston passes TDC. Advanced timing (fires too early) causes detonation; retarded timing reduces power and increases engine temperature.',
  },
  {
    id: 'PME-015',
    exam: 'powerplant',
    topic: 'instruments',
    question: 'Exhaust Gas Temperature (EGT) is used primarily to',
    options: {
      A: 'indicate engine power output',
      B: 'set the optimal fuel/air mixture for maximum efficiency or best power',
      C: 'detect turbine blade failure',
      D: 'monitor catalytic converter efficiency',
    },
    correct: 'B',
    explanation:
      'EGT is used to set the fuel/air mixture. As mixture is leaned from full rich, EGT rises to a peak (peak EGT), then drops as the mixture becomes too lean. Pilots set mixture based on EGT — typically 50°F rich of peak for best power or at peak for best economy, per the POH.',
  },
  {
    id: 'PME-016',
    exam: 'powerplant',
    topic: 'lubrication',
    question: 'A wet-sump lubrication system differs from a dry-sump system in that',
    options: {
      A: 'wet-sump uses synthetic oil; dry-sump uses mineral oil',
      B: 'in a wet-sump system, oil is stored in the engine crankcase sump',
      C: 'wet-sump systems use higher oil pressure than dry-sump systems',
      D: 'dry-sump systems are only used on turbine engines',
    },
    correct: 'B',
    explanation:
      'In a wet-sump system (most light aircraft), oil is stored in the engine crankcase. A dry-sump system uses a separate remote oil tank with scavenge pumps to remove oil from the engine and return it to the tank — better for aerobatic aircraft (prevents oil starvation in inverted flight) and large engines.',
  },
  {
    id: 'PME-017',
    exam: 'powerplant',
    topic: 'propellers',
    question: 'Propeller blade tracking is performed to determine if',
    options: {
      A: 'the blade pitch is set correctly for cruise',
      B: 'all blades of a multi-blade propeller rotate in the same plane',
      C: 'the propeller governor is functioning correctly',
      D: 'the propeller is balanced dynamically',
    },
    correct: 'B',
    explanation:
      'Propeller tracking checks that all blades tip-path planes are the same — i.e., that all blade tips rotate at the same distance from a reference plane. A blade that is out of track (tip is ahead of or behind the others) indicates a bent blade or flange misalignment. Out-of-track propellers cause vibration and increased structural loads.',
  },
  {
    id: 'PME-018',
    exam: 'powerplant',
    topic: 'inspections',
    question: 'When performing a borescope inspection of a turbine engine, the technician is examining',
    options: {
      A: 'the fuel control unit calibration',
      B: 'the internal condition of compressor and turbine blades without engine disassembly',
      C: 'the external condition of the engine case for cracks',
      D: 'the combustion chamber for correct fuel nozzle positioning',
    },
    correct: 'B',
    explanation:
      'A borescope is a flexible or rigid optical instrument inserted through inspection ports to visually examine internal engine components without disassembly. It is used to inspect compressor blades, combustion liners, turbine blades, and other internal components for damage, erosion, cracks, and FOD.',
  },
  {
    id: 'PME-019',
    exam: 'powerplant',
    topic: 'turbine-theory',
    question: 'The compressor pressure ratio in a gas turbine engine is the ratio of',
    options: {
      A: 'inlet total pressure to outlet static pressure',
      B: 'compressor discharge pressure to compressor inlet pressure',
      C: 'turbine inlet pressure to exhaust pressure',
      D: 'fan pressure to core pressure',
    },
    correct: 'B',
    explanation:
      'Compressor pressure ratio = compressor discharge pressure / compressor inlet pressure. A pressure ratio of 30:1 means the compressor raises air pressure 30 times above intake pressure. Higher pressure ratios allow more fuel to be burned efficiently, improving thermal efficiency and thrust.',
  },
  {
    id: 'PME-020',
    exam: 'powerplant',
    topic: 'recip-theory',
    question: 'Carburetor icing is most likely to occur at',
    options: {
      A: 'outside air temperatures below -20°C',
      B: 'high power settings with high humidity',
      C: 'temperatures between 20°F and 70°F with visible moisture or high relative humidity',
      D: 'temperatures above 90°F and low humidity',
    },
    correct: 'C',
    explanation:
      'Carburetor ice forms due to the temperature drop caused by fuel vaporization and venturi effect in the carburetor throat. This can lower the carburetor temperature 30-40°F below OAT. Ice can form at OATs as high as 70°F with high humidity. It is most insidious in cool, moist conditions — not extreme cold.',
  },
]
