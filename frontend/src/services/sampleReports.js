export const SAMPLE_REPORTS = [
  {
    id: 'sample-1',
    title: 'Working at Height (High Risk)',
    category: 'Fall Protection',
    riskLevel: 'SIF',
    text: 'Worker climbed a scaffold at 8 meters height without securing safety harness lanyard to anchor point during pipe rack installation.',
    tags: ['Working at Height', 'Scaffold', 'Fall Protection', 'Lanyard'],
  },
  {
    id: 'sample-2',
    title: 'Gas Leak Near Furnace (High Risk)',
    category: 'Hazardous Environment',
    riskLevel: 'SIF',
    text: 'Detected hydrocarbon vapor leakage near distillation furnace unit. Portable gas detector alarmed at 35% LEL, but hot work permit was still active.',
    tags: ['Hydrocarbon Leak', 'Furnace', 'Hot Work', 'Gas Detector'],
  },
  {
    id: 'sample-3',
    title: 'Slippery Walkway (Low Risk)',
    category: 'Housekeeping',
    riskLevel: 'Non-SIF',
    text: 'Minor water spillage observed on walkway corridor outside workshop room 3. Caution wet floor sign posted and janitorial notified.',
    tags: ['Water Spill', 'Walkway', 'Housekeeping', 'Slip Risk'],
  },
  {
    id: 'sample-4',
    title: 'Electrical Panel Lockout (High Risk)',
    category: 'Electrical Safety',
    riskLevel: 'SIF',
    text: 'Technician performed maintenance inside 415V motor control center panel without applying LOTO (Lockout/Tagout) isolation padlocks.',
    tags: ['Electrical 415V', 'LOTO Failure', 'Maintenance', 'High Voltage'],
  },
  {
    id: 'sample-5',
    title: 'Missing Helmet Strap (Low Risk)',
    category: 'PPE Inspection',
    riskLevel: 'Non-SIF',
    text: 'Contractor worker observed wearing safety helmet without chin strap secured while walking across material storage yard.',
    tags: ['PPE', 'Chin Strap', 'Safety Helmet', 'Storage Yard'],
  },
  {
    id: 'sample-6',
    title: 'Heavy Crane Rigging (High Risk)',
    category: 'Lifting Operations',
    riskLevel: 'SIF',
    text: 'Rigging crew attempted 15-ton pipe section lift using damaged wire rope sling with frayed strands under suspended load zone.',
    tags: ['Crane Lifting', 'Rigging Failure', 'Suspended Load', 'Damaged Sling'],
  }
];

export default SAMPLE_REPORTS;
