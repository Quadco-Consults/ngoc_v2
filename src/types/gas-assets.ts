export type FacilityStatus = 'operational' | 'maintenance' | 'critical' | 'offline';
export type FieldStatus = 'producing' | 'development' | 'exploration' | 'shut-in';
export type PipelineType = 'transmission' | 'gathering' | 'distribution';

export interface Location {
  lat: number;
  lng: number;
}

export interface GasField {
  id: string;
  name: string;
  oml: string;
  operator: string;
  location: Location;
  status: FieldStatus;
  reserves: {
    proven: number;      // BCF
    probable: number;    // BCF
    possible: number;    // BCF
  };
  currentProduction: number;  // MMSCF/D
  capacity: number;          // MMSCF/D
  startDate: string;
  wells: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasWell {
  id: string;
  name: string;
  fieldId: string;
  fieldName: string;
  type: 'production' | 'injection' | 'exploration';
  status: FacilityStatus;
  location: Location;
  depth: number;              // meters
  production: number;         // MMSCF/D
  pressure: number;           // PSI
  temperature: number;        // Celsius
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasPipeline {
  id: string;
  name: string;
  type: PipelineType;
  diameter?: number;          // inches
  length?: number;            // km
  size?: string;              // Size in format "diameter x length" (e.g., "40\" x 92km")
  installedCapacity: number;  // MMSCF/D
  operatingCapacity?: number; // MMSCF/D
  capacity?: number;          // Legacy field for compatibility
  currentFlow?: number;       // MMSCF/D
  pressure?: {
    inlet: number;            // PSI
    outlet: number;           // PSI
  };
  temperature?: number;       // Celsius
  status: FacilityStatus;
  route?: Location[];
  fromFacility?: string;
  toFacility?: string;
  operator: string;
  deliveryMarkets?: string[]; // NLNG, Domestic, etc.
  commissionDate?: string;
  lastInspection?: string;
  nextInspection?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasPlant {
  id: string;
  name: string;
  type: 'processing' | 'ngl' | 'lpg' | 'fractionation' | 'nag' | 'ag' | 'cpf' | 'fpso';
  location: Location;
  operator: string;
  installedCapacity: number;       // MMSCF/D
  operatingCapacity?: number;      // MMSCF/D
  capacity?: number;               // Legacy field for compatibility
  throughput?: number;             // MMSCF/D
  nglProduction?: number;          // barrels/day
  lpgProduction?: number;          // MT/day
  status: FacilityStatus;
  efficiency?: number;             // percentage
  trains?: number;
  gasSupplyFields?: string[];      // OML fields
  deliveryMarkets?: string[];      // NLNG Export, Domestic, etc.
  commissionDate?: string;
  lastTurnaround?: string;
  nextTurnaround?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LNGTerminal {
  id: string;
  name: string;
  location: Location;
  operator: string;
  trains: number;
  capacity: number;           // MTPA (Million Tonnes Per Annum)
  currentProduction: number;  // MTPA
  storage: {
    capacity: number;         // cubic meters
    current: number;          // cubic meters
  };
  status: FacilityStatus;
  feedGasSource: string[];
  exportDestinations: string[];
  commissionDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompressionStation {
  id: string;
  name: string;
  location: Location;
  operator: string;
  pipelineId: string;
  compressors: number;
  capacity: number;           // MMSCF/D
  inletPressure: number;      // PSI
  outletPressure: number;     // PSI
  fuelGasConsumption: number; // MMSCF/D
  status: FacilityStatus;
  efficiency: number;         // percentage
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeteringStation {
  id: string;
  name: string;
  location: Location;
  operator: string;
  type: 'custody-transfer' | 'fiscal' | 'allocation';
  pipelineId?: string;
  flow: number;               // MMSCF/D
  pressure: number;           // PSI
  temperature: number;        // Celsius
  lastCalibration: string;
  nextCalibration: string;
  accuracy: number;           // percentage
  status: FacilityStatus;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PowerStation {
  id: string;
  name: string;
  location: Location;
  operator: string;
  capacity: number;           // MW
  gasConsumption: number;     // MMSCF/D
  generation: number;         // MW
  efficiency: number;         // percentage
  status: FacilityStatus;
  turbines: number;
  supplier: string;           // Gas supplier
  contractId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AGGType =
  | 'NGL Extraction'
  | 'Hydrocarbon'
  | 'Natural Gas'
  | 'Condensate'
  | 'Fuel Gas C3/C4 LPG C5+';

export type ProcessingType =
  | 'Hydrocarbon Dew Point'
  | 'Water Dew Pointing'
  | 'Gas Compression only'
  | 'Gas Compression and Processing (TEG Dehydration)'
  | 'N/A';

export interface AGGStation {
  id: string;
  name: string;
  location: Location;
  status: FacilityStatus;
  numberOfTrains: number;
  aggType: AGGType;
  processingType: ProcessingType;
  specification?: {
    dewPointTemp?: number;      // Deg C
    exportPressure?: number;    // PSI
  };
  utilization: number;          // percentage
  designCapacity: number;       // MMSCFD
  availableCapacity: number;    // MMSCFD
  dateCompleted?: string;
  dateCommissioned?: string;
  constructionCost?: number;    // $m
  grossLiquidCapacity?: number; // KBOPD
  gasCapacity?: number;         // MMSCFD
  temperature?: number;         // Deg C
  pressure?: number;            // PSI
  operator: string;
  station?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SlugCatcher {
  id: string;
  name: string;
  location: Location;
  operator: string;
  pipelineId: string;
  liquidHandlingVolume: number; // m³
  designPressure: number;        // bar
  status: FacilityStatus;
  type?: 'overhead' | 'bottom';
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JunctionNode {
  id: string;
  name: string;
  location: Location;
  operator: string;
  type: 'junction' | 'crossover' | 'convergent' | 'divergent';
  connectedPipelines: string[];  // Pipeline IDs
  capacity?: number;              // MMSCF/D
  pressure?: number;              // bar or PSI
  status: FacilityStatus;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LNGTrain {
  id: string;
  name: string;
  terminalId: string;
  trainNumber: number;
  capacity: number;              // MTPA
  feedGasCapacity: number;       // MMSCF/D
  status: FacilityStatus;
  commissionDate: string;
  technology: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RiserPlatform {
  id: string;
  name: string;
  location: Location;
  operator: string;
  type: 'subsea' | 'offshore' | 'onshore';
  pipelineId?: string;
  pressure: number;              // bar or PSI
  status: FacilityStatus;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}
