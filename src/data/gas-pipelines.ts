import type { GasPipeline } from '../types/gas-assets';

export const gasPipelinesData: GasPipeline[] = [
  // SPDC Pipelines
  {
    id: 'pipeline-001',
    name: 'EGGS 1 (Soku-Bonny)',
    operator: 'SPDC',
    type: 'transmission',
    size: '40" x',
    installedCapacity: 1490,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.659, lng: 6.608 }, // Soku NAG
      { lat: 4.55, lng: 6.9 }, // Waypoint
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Soku NAG',
    toFacility: 'NLNG Bonny',
  },
  {
    id: 'pipeline-002',
    name: 'EGGS 2 (Gbaran-Kolo Creek - Soku)',
    operator: 'SPDC',
    type: 'transmission',
    installedCapacity: 1400,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.0078, lng: 6.2939 }, // Gbaran-Ubie
      { lat: 4.9, lng: 6.4 }, // Kolo Creek area
      { lat: 4.8, lng: 6.5 }, // Waypoint
      { lat: 4.659, lng: 6.608 }, // Soku
    ],
    fromFacility: 'Gbaran-Ubie',
    toFacility: 'Soku',
  },
  {
    id: 'pipeline-003',
    name: 'Kolo Creek - Soku (K2S)',
    operator: 'SPDC',
    type: 'transmission',
    size: '20" x 40km',
    diameter: 20,
    length: 40,
    installedCapacity: 500,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    remark: 'Bulkline for transporting Kolo Creek gas to soku gas plant for treatment and supply to NLNG',
    route: [
      { lat: 4.9, lng: 6.4 }, // Kolo Creek
      { lat: 4.8, lng: 6.5 }, // Waypoint
      { lat: 4.659, lng: 6.608 }, // Soku
    ],
    fromFacility: 'Kolo Creek',
    toFacility: 'Soku',
  },
  {
    id: 'pipeline-004',
    name: 'North Bank CPF - Odidi Manifold',
    operator: 'SPDC',
    type: 'transmission',
    size: '16" x 26km',
    diameter: 16,
    length: 26,
    installedCapacity: 300,
    operatingCapacity: 40,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.0, lng: 6.7 }, // North Bank CPF
      { lat: 4.9, lng: 6.75 }, // Odidi Manifold
    ],
    fromFacility: 'North Bank CPF',
    toFacility: 'Odidi Manifold',
  },
  {
    id: 'pipeline-005',
    name: 'Tunu-EA RPA',
    operator: 'SPDC',
    type: 'transmission',
    size: '16" x 32km',
    diameter: 16,
    length: 32,
    installedCapacity: 300,
    operatingCapacity: 100,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.0258, lng: 5.4503 }, // Tunu CPF
      { lat: 4.85, lng: 5.7 }, // Waypoint
      { lat: 4.7, lng: 6.1 }, // EA RPA (East Area Receiving Platform Area)
    ],
    fromFacility: 'Tunu CPF',
    toFacility: 'EA RPA',
  },
  {
    id: 'pipeline-006',
    name: 'Bonga FPSO - EA RPA',
    operator: 'SPDC',
    type: 'transmission',
    size: '16" x 92km',
    diameter: 16,
    length: 92,
    installedCapacity: 260,
    operatingCapacity: 75,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.3, lng: 5.1 }, // Bonga FPSO (offshore)
      { lat: 4.5, lng: 5.6 }, // Waypoint
      { lat: 4.7, lng: 6.1 }, // EA RPA
    ],
    fromFacility: 'Bonga FPSO',
    toFacility: 'EA RPA',
  },
  {
    id: 'pipeline-007',
    name: 'Sea Eagle - EA RPA',
    operator: 'SPDC',
    type: 'transmission',
    size: '12" x 10km',
    diameter: 12,
    length: 10,
    installedCapacity: 100,
    operatingCapacity: 25,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.6, lng: 6.0 }, // Sea Eagle Platform (offshore)
      { lat: 4.7, lng: 6.1 }, // EA RPA
    ],
    fromFacility: 'Sea Eagle',
    toFacility: 'EA RPA',
  },
  {
    id: 'pipeline-008',
    name: 'GTS3 (OGGS) (EA RPA - Bonny)',
    operator: 'SPDC',
    type: 'transmission',
    size: '32" x 264km',
    diameter: 32,
    length: 264,
    installedCapacity: 1200,
    operatingCapacity: 200,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.7, lng: 6.1 }, // EA RPA
      { lat: 4.6, lng: 6.5 }, // Waypoint 1
      { lat: 4.5, lng: 6.9 }, // Waypoint 2
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'EA RPA',
    toFacility: 'NLNG Bonny',
  },
  {
    id: 'pipeline-009',
    name: 'GTS3 (EA RPA - North Bank CPF)',
    operator: 'SPDC',
    type: 'transmission',
    size: '24" x 98km',
    diameter: 24,
    length: 98,
    installedCapacity: 800,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.7, lng: 6.1 }, // EA RPA
      { lat: 4.85, lng: 6.4 }, // Waypoint
      { lat: 5.0, lng: 6.7 }, // North Bank CPF
    ],
    fromFacility: 'EA RPA',
    toFacility: 'North Bank CPF',
  },
  {
    id: 'pipeline-010',
    name: 'BNAG Export',
    operator: 'SPDC',
    type: 'transmission',
    size: '16" x 2km',
    diameter: 16,
    length: 2,
    installedCapacity: 450,
    operatingCapacity: 150,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.4265, lng: 7.1653 }, // Bonny NAG
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Bonny NAG',
    toFacility: 'NLNG Bonny',
  },
  {
    id: 'pipeline-011',
    name: 'ANOH-Obite',
    operator: 'SPDC',
    type: 'transmission',
    size: '12" x 28km',
    diameter: 12,
    length: 28,
    installedCapacity: 250,
    status: 'offline',
    deliveryMarkets: ['Domestic'],
    remark: 'OSD 2021',
    route: [
      { lat: 5.4, lng: 6.8 }, // ANOH area
      { lat: 5.3, lng: 6.75 }, // Waypoint
      { lat: 5.2394, lng: 6.6586 }, // Obite
    ],
    fromFacility: 'ANOH',
    toFacility: 'Obite',
  },

  // NLNG Pipelines (GTS1 network)
  {
    id: 'pipeline-012',
    name: 'GTS1 (Obite-Ubeta)',
    operator: 'NLNG',
    type: 'transmission',
    size: '16" x 12km',
    diameter: 16,
    length: 12,
    installedCapacity: 381,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.2394, lng: 6.6586 }, // Obite
      { lat: 5.15, lng: 6.95 }, // Ubeta
    ],
    fromFacility: 'Obite',
    toFacility: 'Ubeta',
  },
  {
    id: 'pipeline-013',
    name: 'GTS1 (Obiafu-Ubeta)',
    operator: 'NLNG',
    type: 'transmission',
    size: '24" x 29km',
    diameter: 24,
    length: 29,
    installedCapacity: 551,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.3814, lng: 6.6919 }, // Obiafu
      { lat: 5.25, lng: 6.85 }, // Waypoint
      { lat: 5.15, lng: 6.95 }, // Ubeta
    ],
    fromFacility: 'Obiafu',
    toFacility: 'Ubeta',
  },
  {
    id: 'pipeline-014',
    name: 'GTS1 (Ubeta-Rumuji)',
    operator: 'NLNG',
    type: 'transmission',
    size: '28" x 33km',
    diameter: 28,
    length: 33,
    installedCapacity: 748,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.15, lng: 6.95 }, // Ubeta
      { lat: 5.05, lng: 7.0 }, // Waypoint
      { lat: 4.95, lng: 7.05 }, // Rumuji
    ],
    fromFacility: 'Ubeta',
    toFacility: 'Rumuji',
  },
  {
    id: 'pipeline-015',
    name: 'GTS1 (Soku-Rumuji)',
    operator: 'NLNG',
    type: 'transmission',
    size: '28" x 41km',
    diameter: 28,
    length: 41,
    installedCapacity: 646,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.659, lng: 6.608 }, // Soku
      { lat: 4.8, lng: 6.85 }, // Waypoint
      { lat: 4.95, lng: 7.05 }, // Rumuji
    ],
    fromFacility: 'Soku',
    toFacility: 'Rumuji',
  },
  {
    id: 'pipeline-016',
    name: 'GTS1 (Rumuji - Bonny)',
    operator: 'NLNG',
    type: 'transmission',
    size: '36" x 86km',
    diameter: 36,
    length: 86,
    installedCapacity: 1250,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.95, lng: 7.05 }, // Rumuji
      { lat: 4.75, lng: 7.08 }, // Waypoint
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Rumuji',
    toFacility: 'NLNG Bonny',
  },

  // TEPNG Pipelines
  {
    id: 'pipeline-017',
    name: 'GTS5 (Akpo-Amenam)',
    operator: 'TEPNG',
    type: 'transmission',
    size: '16" x 145km',
    diameter: 16,
    length: 145,
    installedCapacity: 448,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.5, lng: 5.5 }, // Akpo FPSO (offshore)
      { lat: 4.7, lng: 6.4 }, // Waypoint
      { lat: 4.9522, lng: 7.3064 }, // Amenam
    ],
    fromFacility: 'Akpo FPSO',
    toFacility: 'Amenam',
  },
  {
    id: 'pipeline-018',
    name: 'GTS5 (Amenam-Bonny)',
    operator: 'TEPNG',
    type: 'transmission',
    size: '24" x 55km',
    diameter: 24,
    length: 55,
    installedCapacity: 710,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 4.9522, lng: 7.3064 }, // Amenam
      { lat: 4.7, lng: 7.25 }, // Waypoint
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Amenam',
    toFacility: 'NLNG Bonny',
  },
  {
    id: 'pipeline-019',
    name: 'OUR (Obite-Ubeta-Rumuji)',
    operator: 'TEPNG',
    type: 'transmission',
    size: '42" x 45km',
    diameter: 42,
    length: 45,
    installedCapacity: 1600,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.2394, lng: 6.6586 }, // Obite
      { lat: 5.15, lng: 6.95 }, // Ubeta
      { lat: 4.95, lng: 7.05 }, // Rumuji
    ],
    fromFacility: 'Obite',
    toFacility: 'Rumuji',
  },
  {
    id: 'pipeline-020',
    name: 'NOPL (Rumuji-Imo River)',
    operator: 'TEPNG',
    type: 'transmission',
    size: '24" x 52km',
    diameter: 24,
    length: 52,
    installedCapacity: 300,
    operatingCapacity: 25,
    status: 'operational',
    deliveryMarkets: ['Domestic'],
    route: [
      { lat: 4.95, lng: 7.05 }, // Rumuji
      { lat: 4.9, lng: 7.05 }, // Waypoint
      { lat: 4.85, lng: 7.05 }, // Imo River
    ],
    fromFacility: 'Rumuji',
    toFacility: 'Imo River',
  },

  // NAOC Pipeline
  {
    id: 'pipeline-021',
    name: 'GTS4 (Obiafu-Bonny)',
    operator: 'NAOC',
    type: 'transmission',
    installedCapacity: 0,
    status: 'operational',
    deliveryMarkets: ['NLNG'],
    route: [
      { lat: 5.3814, lng: 6.6919 }, // Obiafu
      { lat: 5.15, lng: 6.95 }, // Waypoint 1
      { lat: 4.95, lng: 7.05 }, // Rumuji (waypoint)
      { lat: 4.75, lng: 7.08 }, // Waypoint 2
      { lat: 4.45, lng: 7.17 }, // NLNG Bonny
    ],
    fromFacility: 'Obiafu',
    toFacility: 'NLNG Bonny',
  },

  // CNL Pipelines
  {
    id: 'pipeline-022',
    name: 'Onshore Gas By-pass Pipeline',
    operator: 'CNL',
    type: 'distribution',
    installedCapacity: 80,
    status: 'operational',
    deliveryMarkets: ['Domestic'],
    route: [
      { lat: 5.7, lng: 5.8 }, // Ughelli area
      { lat: 5.8, lng: 5.9 }, // Waypoint
      { lat: 5.9, lng: 6.0 }, // Aladja area
    ],
    fromFacility: 'Ughelli',
    toFacility: 'Aladja',
  },
  {
    id: 'pipeline-023',
    name: 'Sonam-Okan NWP',
    operator: 'CNL',
    type: 'transmission',
    size: '20" x 32km',
    diameter: 20,
    length: 32,
    installedCapacity: 450,
    status: 'operational',
    deliveryMarkets: ['Domestic'],
    route: [
      { lat: 4.7, lng: 5.8 }, // Sonam area
      { lat: 4.8, lng: 6.0 }, // Waypoint
      { lat: 4.9, lng: 6.2 }, // Okan area
    ],
    fromFacility: 'Sonam',
    toFacility: 'Okan',
  },
];
