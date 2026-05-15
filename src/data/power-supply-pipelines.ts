import type { GasPipeline } from '../types/gas-assets';

// Supply pipelines connecting gas plants to power stations
export const powerSupplyPipelines: GasPipeline[] = [
  // Escravos to Egbin (Lagos)
  {
    id: 'supply-001',
    name: 'Escravos-Egbin Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 180,
    operatingCapacity: 180,
    status: 'operational',
    route: [
      { lat: 5.5336, lng: 5.0900 }, // Escravos
      { lat: 6.5774, lng: 3.6531 }, // Egbin Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Egbin Power Station',
  },
  // Okoloma to Afam Power area
  {
    id: 'supply-002',
    name: 'Okoloma-Afam Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 200,
    operatingCapacity: 150,
    status: 'operational',
    route: [
      { lat: 4.7833, lng: 7.0167 }, // Okoloma NAG
      { lat: 4.8417, lng: 7.1333 }, // Afam Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Afam area power plants',
  },
  // Gbaran to Azura-Edo
  {
    id: 'supply-003',
    name: 'Gbaran-Azura Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 80,
    operatingCapacity: 78,
    status: 'operational',
    route: [
      { lat: 5.0078, lng: 6.2939 }, // Gbaran
      { lat: 6.5244, lng: 5.7526 }, // Azura-Edo IPP
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Dedicated gas supply to Azura-Edo IPP',
  },
  // Utorogu to Geregu
  {
    id: 'supply-004',
    name: 'Utorogu-Geregu Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 150,
    operatingCapacity: 120,
    status: 'operational',
    route: [
      { lat: 5.7333, lng: 6.0167 }, // Utorogu
      { lat: 6.7456, lng: 6.7569 }, // Geregu Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Geregu Power Station',
  },
  // Obiafu-Obrikom to Olorunsogo
  {
    id: 'supply-005',
    name: 'Obiafu-Olorunsogo Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 120,
    operatingCapacity: 90,
    status: 'operational',
    route: [
      { lat: 5.3814, lng: 6.6919 }, // Obiafu
      { lat: 6.8333, lng: 4.2833 }, // Olorunsogo Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Olorunsogo area power plants',
  },
  // Escravos to Omotosho
  {
    id: 'supply-006',
    name: 'Escravos-Omotosho Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 70,
    operatingCapacity: 65,
    status: 'operational',
    route: [
      { lat: 5.5336, lng: 5.0900 }, // Escravos
      { lat: 6.5833, lng: 4.8333 }, // Omotosho Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Omotosho Power Station',
  },
  // Gbaran to Ihovbor
  {
    id: 'supply-007',
    name: 'Gbaran-Ihovbor Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 90,
    operatingCapacity: 85,
    status: 'operational',
    route: [
      { lat: 5.0078, lng: 6.2939 }, // Gbaran
      { lat: 6.3500, lng: 5.6500 }, // Ihovbor Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Ihovbor NIPP',
  },
  // Okoloma to Trans-Amadi
  {
    id: 'supply-008',
    name: 'Okoloma-Trans-Amadi Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 100,
    operatingCapacity: 65,
    status: 'operational',
    route: [
      { lat: 4.7833, lng: 7.0167 }, // Okoloma NAG
      { lat: 4.8167, lng: 7.0333 }, // Trans-Amadi Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Trans-Amadi Power Station',
  },
  // Utorogu to Sapele
  {
    id: 'supply-009',
    name: 'Utorogu-Sapele Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 180,
    operatingCapacity: 120,
    status: 'operational',
    route: [
      { lat: 5.7333, lng: 6.0167 }, // Utorogu
      { lat: 5.8938, lng: 5.6761 }, // Sapele Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Sapele Power Station',
  },
  // Escravos to Delta (Ughelli)
  {
    id: 'supply-010',
    name: 'Escravos-Delta Supply Line',
    type: 'distribution',
    operator: 'NGC',
    installedCapacity: 140,
    operatingCapacity: 110,
    status: 'operational',
    route: [
      { lat: 5.5336, lng: 5.0900 }, // Escravos
      { lat: 5.4833, lng: 6.0167 }, // Delta (Ughelli) Power Station
    ],
    deliveryMarkets: ['Power Generation'],
    remark: 'Gas supply to Delta (Ughelli) Power Station',
  },
];
