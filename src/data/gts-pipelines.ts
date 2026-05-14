import type { GasPipeline } from '../types/gas-assets';

/**
 * NLNG Gas Transmission System (GTS) Pipelines
 * Source: NLNG Pipeline System (2015) Schematic Diagram
 */
export const gtsPipelinesData: GasPipeline[] = [
  // GTS-1 System
  {
    id: 'pipeline-gts1',
    name: 'GTS-1 (Gas Transmission System 1)',
    type: 'transmission',
    diameter: 42,
    length: 45.6,
    size: '42" x 45.6km',
    installedCapacity: 1250,
    operatingCapacity: 1250,
    currentFlow: 1200,
    pressure: {
      inlet: 1334, // 92 bar
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 5.2, lng: 6.5 }, // Obiafu area
      { lat: 4.95, lng: 7.05 }, // Rumuji
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Obiafu',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
    remark: 'Main transmission line from Obiafu to NLNG with slug catcher (150m³ liquid volume, 95 bar design pressure)',
  },

  // GTS-2 System (multiple segments)
  {
    id: 'pipeline-gts2-main',
    name: 'GTS-2 Main (Gbaran to NLNG)',
    type: 'transmission',
    diameter: 40,
    length: 100,
    size: '40" x 100km',
    installedCapacity: 1400,
    operatingCapacity: 1350,
    currentFlow: 1300,
    pressure: {
      inlet: 1334, // 92 bar
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 5.0078, lng: 6.2939 }, // Gbaran-Ubie
      { lat: 4.659, lng: 6.608 }, // Soku
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Gbaran-Ubie',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
    remark: 'GTS-2/4 Slug Catcher (1250m³ liquid volume, 95 bar design pressure)',
  },

  {
    id: 'pipeline-gts2-soku',
    name: 'GTS-2 Soku Segment',
    type: 'transmission',
    diameter: 32,
    length: 264,
    size: '32" x 264km',
    installedCapacity: 1200,
    operatingCapacity: 1150,
    currentFlow: 1100,
    pressure: {
      inlet: 1334,
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 4.659, lng: 6.608 }, // Soku
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Soku NAG',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
  },

  // GTS-3 System (OGGS - Offshore Gas Gathering System)
  {
    id: 'pipeline-gts3-bonga',
    name: 'GTS-3 (OGGS) Bonga Line',
    type: 'transmission',
    diameter: 36,
    length: 82,
    size: '36" x 82km',
    installedCapacity: 700,
    operatingCapacity: 650,
    currentFlow: 620,
    pressure: {
      inlet: 2755, // 190 bar
      outlet: 2755,
    },
    status: 'operational',
    route: [
      { lat: 4.3, lng: 5.1 }, // Bonga FPSO (offshore)
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Bonga FPSO',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
    remark: 'GTS-3 Slug Catcher (1000m³ liquid volume, 150 bar design pressure). Includes riser platform',
  },

  {
    id: 'pipeline-gts3-amenam',
    name: 'GTS-3 Amenam Segment',
    type: 'transmission',
    diameter: 24,
    length: 55,
    size: '24" x 55km',
    installedCapacity: 710,
    operatingCapacity: 680,
    currentFlow: 650,
    pressure: {
      inlet: 1334,
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 4.9522, lng: 7.3064 }, // Amenam
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Amenam GP',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
  },

  // GTS-4 System (Loop Line)
  {
    id: 'pipeline-gts4',
    name: 'GTS-4 Loop Line',
    type: 'transmission',
    diameter: 42,
    length: 82,
    size: '42" x 82km',
    installedCapacity: 1250,
    operatingCapacity: 1200,
    currentFlow: 1150,
    pressure: {
      inlet: 1088, // 75 bar
      outlet: 1088,
    },
    status: 'operational',
    route: [
      { lat: 4.95, lng: 7.05 }, // Rumuji
      { lat: 4.75, lng: 7.08 }, // GTS-1 & 4 X-Over
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Rumuji Node',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
    remark: 'Loop line providing operational flexibility with GTS-1. Crossover at KP 28 from NLNG',
  },

  // GTS-5 System
  {
    id: 'pipeline-gts5-akpo',
    name: 'GTS-5 Akpo Line',
    type: 'transmission',
    diameter: 40,
    length: 55,
    size: '40" x 55km',
    installedCapacity: 1400,
    operatingCapacity: 1350,
    currentFlow: 1300,
    pressure: {
      inlet: 2755, // 190 bar
      outlet: 2755,
    },
    status: 'operational',
    route: [
      { lat: 4.5, lng: 5.5 }, // Akpo FPSO (offshore)
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Akpo FPSO',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
    remark: 'Offshore gas transmission line with high pressure (190 bar)',
  },

  // GTS-6 System (Future)
  {
    id: 'pipeline-gts6',
    name: 'GTS-6 (Future Pipeline)',
    type: 'transmission',
    diameter: 12,
    length: 50,
    size: '12" x 50km',
    installedCapacity: 120,
    operatingCapacity: 0,
    currentFlow: 0,
    pressure: {
      inlet: 1334,
      outlet: 1334,
    },
    status: 'offline',
    route: [
      { lat: 5.5, lng: 6.0 }, // Oso Platform area
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Oso Platform',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
    remark: 'Future GTS-6 pipeline with slug catcher planned',
  },

  // OUR Pipeline System (Obite-Ubeta-Rumuji)
  {
    id: 'pipeline-our-obite-ubeta',
    name: 'OUR Pipeline (Obite-Ubeta)',
    type: 'transmission',
    diameter: 20,
    length: 12,
    size: '20" x 12km',
    installedCapacity: 300,
    operatingCapacity: 280,
    currentFlow: 260,
    pressure: {
      inlet: 1334,
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 5.2394, lng: 6.6586 }, // Obite
      { lat: 5.15, lng: 6.95 }, // Ubeta
    ],
    fromFacility: 'Obite GP',
    toFacility: 'Ubeta Node',
    operator: 'NNPC',
    deliveryMarkets: ['NLNG Export', 'Domestic'],
  },

  {
    id: 'pipeline-our-ubeta-rumuji',
    name: 'OUR Pipeline (Ubeta-Rumuji)',
    type: 'transmission',
    diameter: 24,
    length: 62,
    size: '24" x 62km',
    installedCapacity: 500,
    operatingCapacity: 480,
    currentFlow: 450,
    pressure: {
      inlet: 1334,
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 5.15, lng: 6.95 }, // Ubeta
      { lat: 4.95, lng: 7.05 }, // Rumuji
    ],
    fromFacility: 'Ubeta Node',
    toFacility: 'Rumuji Node',
    operator: 'NNPC',
    deliveryMarkets: ['NLNG Export', 'Domestic'],
  },

  // NOPL (Northern Option Pipeline for Domestic Gas)
  {
    id: 'pipeline-nopl-main',
    name: 'NOPL (Northern Option Pipeline)',
    type: 'transmission',
    diameter: 24,
    length: 70,
    size: '24" x 70km',
    installedCapacity: 300,
    operatingCapacity: 280,
    currentFlow: 260,
    pressure: {
      inlet: 1088,
      outlet: 1088,
    },
    status: 'operational',
    route: [
      { lat: 4.95, lng: 7.05 }, // Rumuji
      { lat: 5.033, lng: 7.117 }, // Obigbo Node
      { lat: 4.85, lng: 7.05 }, // Imo River Facility
    ],
    fromFacility: 'Rumuji Node',
    toFacility: 'Imo River NGC Facility',
    operator: 'NGC',
    deliveryMarkets: ['Domestic'],
    remark: 'Rich gas pipeline to domestic market, option for northern delivery',
  },

  {
    id: 'pipeline-nopl-alaoji',
    name: 'NOPL Alaoji Extension',
    type: 'distribution',
    diameter: 16,
    length: 90,
    size: '16" x 90km',
    installedCapacity: 200,
    operatingCapacity: 180,
    currentFlow: 145,
    pressure: {
      inlet: 1088,
      outlet: 1088,
    },
    status: 'operational',
    route: [
      { lat: 4.85, lng: 7.05 }, // Imo River
      { lat: 5.12, lng: 7.37 }, // Alaoji PP
    ],
    fromFacility: 'Imo River NGC Facility',
    toFacility: 'Alaoji Power Plant',
    operator: 'NGC',
    deliveryMarkets: ['Domestic'],
  },

  // Bonny NAG to NLNG Line
  {
    id: 'pipeline-bonny-nag',
    name: 'Bonny NAG to NLNG Line',
    type: 'transmission',
    diameter: 12,
    length: 5,
    size: '12" x 5km',
    installedCapacity: 100,
    operatingCapacity: 90,
    currentFlow: 85,
    pressure: {
      inlet: 1334,
      outlet: 1334,
    },
    status: 'operational',
    route: [
      { lat: 4.4265, lng: 7.1653 }, // Bonny NAG
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Bonny NAG',
    toFacility: 'NLNG Bonny',
    operator: 'NLNG',
    deliveryMarkets: ['NLNG Export'],
  },

  // Eastern Network Pipelines
  {
    id: 'pipeline-okoloma-obigbo',
    name: 'Okoloma to Obigbo Pipeline',
    type: 'transmission',
    diameter: 24,
    length: 2,
    size: '24" x 2km',
    installedCapacity: 161,
    operatingCapacity: 150,
    currentFlow: 145,
    pressure: {
      inlet: 1088, // 75 bar
      outlet: 1088,
    },
    status: 'operational',
    route: [
      { lat: 4.7833, lng: 7.0167 }, // Okoloma NAG
      { lat: 5.033, lng: 7.117 }, // Obigbo Node
    ],
    fromFacility: 'Okoloma NAG',
    toFacility: 'Obigbo Node',
    operator: 'NGC',
    deliveryMarkets: ['Domestic'],
    remark: '75 MMscfd flow, key for Afam VI, FIPL Afam IV and eastern domestic corridor',
  },

  {
    id: 'pipeline-obigbo-north',
    name: 'Obigbo North Pipeline',
    type: 'transmission',
    diameter: 20,
    length: 8,
    size: '20" x 8km',
    installedCapacity: 106,
    operatingCapacity: 100,
    currentFlow: 86,
    pressure: {
      inlet: 1088,
      outlet: 1088,
    },
    status: 'operational',
    route: [
      { lat: 5.0, lng: 7.0 }, // Obigbo North area
      { lat: 5.033, lng: 7.117 }, // Obigbo Node
    ],
    fromFacility: 'Obigbo North',
    toFacility: 'Obigbo Node',
    operator: 'NGC',
    deliveryMarkets: ['Domestic'],
    remark: '86 MMscfd capacity',
  },

  {
    id: 'pipeline-obigbo-ukanafun',
    name: 'Obigbo to Ukanafun Pipeline',
    type: 'transmission',
    diameter: 20,
    length: 41,
    size: '20" x 41km',
    installedCapacity: 400,
    operatingCapacity: 380,
    currentFlow: 350,
    pressure: {
      inlet: 1248, // 86 bar (min)
      outlet: 1248,
    },
    status: 'operational',
    route: [
      { lat: 5.033, lng: 7.117 }, // Obigbo Node
      { lat: 5.1, lng: 7.65 }, // Ukanafun
    ],
    fromFacility: 'Obigbo Node',
    toFacility: 'Ukanafun Junction',
    operator: 'NGC',
    deliveryMarkets: ['Domestic'],
    remark: 'Serves Calabar, Ikot Abasi, ALSCON, Seven Energy (200 MMscfd), QIT MS (200 MMscfd)',
  },

  {
    id: 'pipeline-cawthorne-alakiri',
    name: 'Cawthorne Channel to Alakiri',
    type: 'gathering',
    diameter: 12,
    length: 15,
    size: '12" x 15km',
    installedCapacity: 145,
    operatingCapacity: 120,
    currentFlow: 100,
    pressure: {
      inlet: 1088,
      outlet: 1088,
    },
    status: 'operational',
    route: [
      { lat: 4.8, lng: 6.8 }, // Cawthorne Channel
      { lat: 4.8, lng: 6.8 }, // Alakiri
    ],
    fromFacility: 'Cawthorne Channel GP',
    toFacility: 'Alakiri',
    operator: 'EROTON',
    deliveryMarkets: ['Domestic'],
    remark: '45 MMscfd from Cawthorne, 100 MMscfd from Alakiri',
  },

  // TNGP (Trans-Nigeria Gas Pipeline) - Planned
  {
    id: 'pipeline-tngp-obob',
    name: 'TNGP to OBOB Segment',
    type: 'transmission',
    diameter: 40,
    length: 88,
    size: '40" x 88km',
    installedCapacity: 640,
    operatingCapacity: 0,
    currentFlow: 0,
    pressure: {
      inlet: 1248,
      outlet: 1248,
    },
    status: 'offline',
    route: [
      { lat: 5.033, lng: 7.117 }, // Obigbo area
      { lat: 5.5, lng: 6.5 }, // OBOB CTMS
    ],
    fromFacility: 'Obigbo Node',
    toFacility: 'OBOB CTMS',
    operator: 'NNPC',
    deliveryMarkets: ['Domestic'],
    remark: 'Planned Trans-Nigeria Gas Pipeline, 140 MMscfd + 500 MMscfd from Assa North',
  },

  // Proposed OUA Pipeline (Obigbo-Umuahia-Ajaokuta)
  {
    id: 'pipeline-oua-proposed',
    name: 'OUA Pipeline (Proposed)',
    type: 'transmission',
    diameter: 28,
    length: 200,
    size: '28" x 200km',
    installedCapacity: 600,
    operatingCapacity: 0,
    currentFlow: 0,
    pressure: {
      inlet: 1248,
      outlet: 1248,
    },
    status: 'offline',
    route: [
      { lat: 5.033, lng: 7.117 }, // Obigbo
      { lat: 5.5, lng: 7.5 }, // Umuahia
      { lat: 7.8, lng: 6.8 }, // Ajaokuta
    ],
    fromFacility: 'Obigbo Node',
    toFacility: 'Ajaokuta',
    operator: 'NNPC',
    deliveryMarkets: ['Domestic'],
    remark: 'Proposed pipeline to Northern markets via Umuahia and Ajaokuta',
  },
];
