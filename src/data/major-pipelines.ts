import type { GasPipeline } from '../types/gas-assets';

// Major Nigerian Gas Pipelines with routing coordinates
export const majorPipelinesData: GasPipeline[] = [
  // AKK Pipeline - Ajaokuta-Kaduna-Kano
  {
    id: 'major-001',
    name: 'AKK Pipeline (Ajaokuta-Kaduna-Kano)',
    type: 'transmission',
    operator: 'NNPC',
    installedCapacity: 2200,
    operatingCapacity: 1800,
    status: 'maintenance',
    size: '40"',
    diameter: 40,
    length: 614,
    route: [
      { lat: 7.5500, lng: 6.6800 }, // Ajaokuta (start point)
      { lat: 7.8500, lng: 6.8000 }, // Waypoint 1
      { lat: 8.5000, lng: 7.2000 }, // Waypoint 2
      { lat: 9.5000, lng: 7.5000 }, // Waypoint 3
      { lat: 10.5263, lng: 7.4398 }, // Kaduna
      { lat: 11.0000, lng: 7.6000 }, // Waypoint 4
      { lat: 11.5000, lng: 7.8000 }, // Waypoint 5
      { lat: 12.0022, lng: 8.5920 }, // Kano (end point)
    ],
    deliveryMarkets: ['Domestic', 'Industrial', 'Power Generation'],
    remark: 'Under construction, designed to transport gas from southern Nigeria to northern states',
  },

  // Escravos-Lagos Pipeline System (ELPS)
  {
    id: 'major-002',
    name: 'Escravos-Lagos Pipeline System (ELPS I)',
    type: 'transmission',
    operator: 'NGC',
    installedCapacity: 650,
    operatingCapacity: 580,
    status: 'operational',
    size: '24"',
    diameter: 24,
    length: 386,
    route: [
      { lat: 5.5336, lng: 5.0900 }, // Escravos
      { lat: 5.7000, lng: 5.3000 }, // Waypoint 1
      { lat: 5.9000, lng: 5.6000 }, // Waypoint 2 (Sapele area)
      { lat: 6.1500, lng: 5.8500 }, // Waypoint 3 (Warri area)
      { lat: 6.3500, lng: 5.6500 }, // Waypoint 4 (Benin area)
      { lat: 6.5500, lng: 5.2000 }, // Waypoint 5 (Ore area)
      { lat: 6.6500, lng: 4.5000 }, // Waypoint 6 (Ijebu Ode area)
      { lat: 6.5244, lng: 3.3792 }, // Lagos
    ],
    deliveryMarkets: ['Domestic', 'Power Generation', 'Industrial'],
    remark: 'Major trunk line supplying Lagos and southwestern Nigeria',
  },

  // ELPS II
  {
    id: 'major-003',
    name: 'Escravos-Lagos Pipeline System (ELPS II)',
    type: 'transmission',
    operator: 'NGC',
    installedCapacity: 1000,
    operatingCapacity: 850,
    status: 'operational',
    size: '30"',
    diameter: 30,
    length: 390,
    route: [
      { lat: 5.5336, lng: 5.0900 }, // Escravos
      { lat: 5.7200, lng: 5.3200 }, // Parallel to ELPS I but slightly different
      { lat: 5.9200, lng: 5.6200 },
      { lat: 6.1700, lng: 5.8700 },
      { lat: 6.3700, lng: 5.6700 },
      { lat: 6.5700, lng: 5.2200 },
      { lat: 6.6700, lng: 4.5200 },
      { lat: 6.5244, lng: 3.3792 }, // Lagos
    ],
    deliveryMarkets: ['Domestic', 'Power Generation', 'Industrial'],
    remark: 'Supplementary line to ELPS I for increased capacity',
  },

  // Obiafu-Obrikom Pipeline (OB3)
  {
    id: 'major-004',
    name: 'Obiafu-Obrikom Gas Pipeline (OB3)',
    type: 'transmission',
    operator: 'NGC',
    installedCapacity: 850,
    operatingCapacity: 820,
    status: 'operational',
    size: '36"',
    diameter: 36,
    length: 56,
    route: [
      { lat: 5.3814, lng: 6.6919 }, // Obiafu
      { lat: 5.4000, lng: 6.7500 }, // Waypoint 1
      { lat: 5.4500, lng: 6.8000 }, // Waypoint 2
      { lat: 5.4778, lng: 6.8639 }, // Obrikom
    ],
    deliveryMarkets: ['NLNG', 'Domestic'],
    remark: 'Critical supply line for domestic and export gas',
  },

  // West African Gas Pipeline (WAGP)
  {
    id: 'major-005',
    name: 'West African Gas Pipeline (WAGP)',
    type: 'transmission',
    operator: 'WAPCo',
    installedCapacity: 170,
    operatingCapacity: 150,
    status: 'operational',
    size: '20"',
    diameter: 20,
    length: 678,
    route: [
      { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
      { lat: 6.4000, lng: 2.6000 }, // Waypoint 1
      { lat: 6.3549, lng: 2.4326 }, // Cotonou, Benin
      { lat: 6.2000, lng: 1.5000 }, // Waypoint 2
      { lat: 6.1372, lng: 1.2221 }, // Lomé, Togo
      { lat: 5.8000, lng: 0.2000 }, // Waypoint 3
      { lat: 5.6037, lng: -0.1870 }, // Accra, Ghana
    ],
    deliveryMarkets: ['Export'],
    remark: 'Regional gas export pipeline to West African countries',
  },

  // Obite-Rumuekpe Pipeline (ORP)
  {
    id: 'major-006',
    name: 'Obite-Rumuekpe Pipeline (ORP)',
    type: 'transmission',
    operator: 'NGC',
    installedCapacity: 550,
    operatingCapacity: 450,
    status: 'operational',
    size: '28"',
    diameter: 28,
    length: 65,
    route: [
      { lat: 5.0833, lng: 6.6167 }, // Obite
      { lat: 5.1500, lng: 6.7000 }, // Waypoint 1
      { lat: 5.2000, lng: 6.8500 }, // Waypoint 2
      { lat: 5.1889, lng: 6.9833 }, // Rumuekpe
    ],
    deliveryMarkets: ['Domestic', 'Power Generation'],
    remark: 'Major supply line for Rivers State power plants',
  },

  // Alakiri-Afam Pipeline
  {
    id: 'major-007',
    name: 'Alakiri-Afam Pipeline',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 300,
    operatingCapacity: 250,
    status: 'operational',
    size: '16"',
    diameter: 16,
    length: 45,
    route: [
      { lat: 4.7833, lng: 7.0167 }, // Alakiri (near Okoloma)
      { lat: 4.8000, lng: 7.0500 }, // Waypoint 1
      { lat: 4.8200, lng: 7.0900 }, // Waypoint 2
      { lat: 4.8417, lng: 7.1333 }, // Afam
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Dedicated supply to Afam power complex',
  },

  // Trans-Saharan Gas Pipeline (Proposed)
  {
    id: 'major-008',
    name: 'Trans-Saharan Gas Pipeline (TSGP) - Nigerian Section',
    type: 'transmission',
    operator: 'NNPC/Sonatrach/GALSI',
    installedCapacity: 1100,
    operatingCapacity: 0,
    status: 'offline',
    size: '48"',
    diameter: 48,
    length: 1037,
    route: [
      { lat: 6.5244, lng: 3.3792 }, // Lagos (starting point)
      { lat: 7.5000, lng: 4.0000 }, // Waypoint 1
      { lat: 9.0000, lng: 7.5000 }, // Waypoint 2 (Abuja area)
      { lat: 11.0000, lng: 8.5000 }, // Waypoint 3 (Kano area)
      { lat: 13.0000, lng: 10.0000 }, // Waypoint 4 (towards Niger border)
    ],
    deliveryMarkets: ['Export'],
    remark: 'Proposed trans-continental pipeline project to Europe via Algeria',
  },

  // Utorogu-Ughelli-Ajaokuta Pipeline
  {
    id: 'major-009',
    name: 'Utorogu-Ughelli-Ajaokuta Pipeline',
    type: 'transmission',
    operator: 'NGC',
    installedCapacity: 450,
    operatingCapacity: 380,
    status: 'operational',
    size: '20"',
    diameter: 20,
    length: 280,
    route: [
      { lat: 5.7333, lng: 6.0167 }, // Utorogu
      { lat: 5.7000, lng: 6.0500 }, // Waypoint 1
      { lat: 5.4833, lng: 6.0167 }, // Ughelli
      { lat: 5.8000, lng: 6.2000 }, // Waypoint 2
      { lat: 6.2000, lng: 6.4000 }, // Waypoint 3
      { lat: 6.6000, lng: 6.6000 }, // Waypoint 4
      { lat: 7.5500, lng: 6.6800 }, // Ajaokuta
    ],
    deliveryMarkets: ['Domestic', 'Industrial'],
    remark: 'Key link between southern gas fields and northern industrial zones',
  },

  // Kwale-Okpai Pipeline
  {
    id: 'major-010',
    name: 'Kwale-Okpai Pipeline',
    type: 'transmission',
    operator: 'SPDC',
    installedCapacity: 480,
    operatingCapacity: 420,
    status: 'operational',
    size: '24"',
    diameter: 24,
    length: 95,
    route: [
      { lat: 5.7097, lng: 6.4344 }, // Kwale
      { lat: 5.7500, lng: 6.5000 }, // Waypoint 1
      { lat: 5.8000, lng: 6.6000 }, // Waypoint 2
      { lat: 5.8500, lng: 6.7500 }, // Waypoint 3
      { lat: 5.8994, lng: 6.8500 }, // Okpai
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Supplies gas to Okpai and Kwale power stations',
  },
];
