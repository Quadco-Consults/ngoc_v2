import type { JunctionNode } from '../types/gas-assets';

export const junctionNodesData: JunctionNode[] = [
  {
    id: 'node-001',
    name: 'Ubeta Node',
    location: { lat: 5.15, lng: 6.95 }, // Approximate
    operator: 'NNPC/NLNG',
    type: 'junction',
    connectedPipelines: ['pipeline-our', 'pipeline-naoc', 'pipeline-obite'],
    capacity: 800,
    status: 'operational',
    remark: 'Key junction connecting NAOC GP, Obite GP to OUR Pipeline',
  },
  {
    id: 'node-002',
    name: 'Rumuji Node',
    location: { lat: 4.95, lng: 7.05 }, // Approximate
    operator: 'NNPC/NLNG',
    type: 'junction',
    connectedPipelines: ['pipeline-our', 'pipeline-gts1', 'pipeline-gts4', 'pipeline-nopl'],
    capacity: 1500,
    status: 'operational',
    remark: 'Major junction connecting OUR to GTS-1, GTS-4 and NOPL',
  },
  {
    id: 'node-003',
    name: 'GTS-1 & 4 X-Over',
    location: { lat: 4.75, lng: 7.08 }, // Approximate
    operator: 'NLNG',
    type: 'crossover',
    connectedPipelines: ['pipeline-gts1', 'pipeline-gts4'],
    capacity: 2500,
    pressure: 92,
    status: 'operational',
    remark: 'Crossover point between GTS-1 and GTS-4 for operational flexibility',
  },
  {
    id: 'node-004',
    name: 'Obigbo Node',
    location: { lat: 5.033, lng: 7.117 },
    operator: 'NGC',
    type: 'convergent',
    connectedPipelines: ['pipeline-okoloma', 'pipeline-obigbo-north', 'pipeline-nopl'],
    capacity: 400,
    status: 'operational',
    remark: 'Eastern network convergence point, connects to domestic gas network',
  },
  {
    id: 'node-005',
    name: 'Imo River NGC Facility Junction',
    location: { lat: 4.85, lng: 7.05 }, // Approximate
    operator: 'NGC',
    type: 'divergent',
    connectedPipelines: ['pipeline-nopl', 'pipeline-alaoji'],
    capacity: 300,
    status: 'operational',
    remark: 'Divergent point serving Alaoji Power Plant and domestic customers',
  },
  {
    id: 'node-006',
    name: 'Cawthorne Channel Junction',
    location: { lat: 4.8, lng: 6.8 },
    operator: 'EROTON',
    type: 'junction',
    connectedPipelines: ['pipeline-alakiri'],
    capacity: 145,
    status: 'operational',
    remark: 'Connects Cawthorne Channel GP to domestic network',
  },
  {
    id: 'node-007',
    name: 'Ukanafun Junction',
    location: { lat: 5.1, lng: 7.65 }, // Approximate
    operator: 'NGC',
    type: 'divergent',
    connectedPipelines: ['pipeline-calabar', 'pipeline-qit'],
    capacity: 400,
    status: 'operational',
    remark: 'Serves Calabar, Ikot Abasi, ALSCON, Seven Energy, QIT MS',
  },
  {
    id: 'node-008',
    name: 'OBOB CTMS Junction',
    location: { lat: 5.5, lng: 6.5 }, // Approximate
    operator: 'NNPC',
    type: 'junction',
    connectedPipelines: ['pipeline-tngp', 'pipeline-assa-north'],
    capacity: 640,
    status: 'operational',
    remark: 'Trans-Nigeria Gas Pipeline junction point',
  },
  {
    id: 'node-009',
    name: 'Assa North Junction',
    location: { lat: 5.6, lng: 6.4 }, // Approximate
    operator: 'NAOC',
    type: 'junction',
    connectedPipelines: ['pipeline-naoc-gp', 'pipeline-tngp'],
    capacity: 500,
    status: 'operational',
    remark: 'NAOC GP connection to TNGP, planned 500 MMscfd',
  },
];
