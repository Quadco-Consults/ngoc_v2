export type NominationStatus = 'pending' | 'approved' | 'rejected' | 'delivered' | 'reconciled' | 'disputed';
export type Priority = 'firm' | 'interruptible';

export interface GasProduction {
  id: string;
  date: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'field' | 'well' | 'plant';
  operator: string;
  production: number;         // MMSCF/D
  capacity: number;           // MMSCF/D
  utilization: number;        // percentage
  nglProduction?: number;     // barrels/day
  lpgProduction?: number;     // MT/day
  flareVolume?: number;       // MMSCF/D
  createdAt?: string;
  updatedAt?: string;
}

export interface FlareRecord {
  id: string;
  facility: string;
  facilityId: string;
  operator: string;
  date: string;
  flareVolume: number;        // MMSCF
  reason: 'operational' | 'safety' | 'emergency' | 'routine' | 'technical';
  duration: number;           // hours
  penalty?: number;           // NGN
  justification: string;
  status: 'reported' | 'under-review' | 'approved' | 'penalty-applied';
  reviewedBy?: string;
  reviewDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasNomination {
  id: string;
  nominationDate: string;
  gasDay: string;
  customer: string;
  customerId: string;
  supplyPoint: string;
  supplyPointId: string;
  deliveryPoint: string;
  deliveryPointId: string;
  nominatedVolume: number;    // MMSCF
  allocatedVolume?: number;   // MMSCF
  actualVolume?: number;      // MMSCF
  status: NominationStatus;
  priority: Priority;
  contractId: string;
  contractName: string;
  submittedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasAllocation {
  id: string;
  nominationId: string;
  gasDay: string;
  customer: string;
  deliveryPoint: string;
  allocatedVolume: number;    // MMSCF
  availableCapacity: number;  // MMSCF
  allocationFactor: number;   // percentage
  priority: Priority;
  allocationDate: string;
  allocatedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasBalancing {
  id: string;
  gasDay: string;
  customer: string;
  customerId: string;
  allocatedVolume: number;    // MMSCF
  deliveredVolume: number;    // MMSCF
  imbalance: number;          // MMSCF (positive = over-delivery, negative = under-delivery)
  imbalancePercentage: number; // percentage
  toleranceBand: number;      // percentage
  penaltyApplicable: boolean;
  penaltyAmount?: number;     // NGN
  status: 'balanced' | 'imbalanced' | 'disputed' | 'reconciled';
  reconciliationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GasContract {
  id: string;
  contractNumber: string;
  contractName: string;
  type: 'gsa' | 'gpa' | 'gta';  // Gas Supply Agreement, Gas Purchase Agreement, Gas Transportation Agreement
  supplier: string;
  supplierId: string;
  buyer: string;
  buyerId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'terminated' | 'suspended';
  dailyContractQuantity: number;  // MMSCF/D (DCQ)
  annualContractQuantity: number; // BCF (ACQ)
  price: number;                  // NGN/MSCF
  pricingFormula?: string;
  takeOrPay: number;              // percentage
  deliveryPoints: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceSchedule {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  maintenanceType: 'routine' | 'preventive' | 'corrective' | 'turnaround';
  scheduledDate: string;
  duration: number;               // hours
  estimatedDeferment: number;     // MMSCF/D
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  contractor?: string;
  cost?: number;                  // NGN
  completionDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Deferment {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  operator: string;
  startDate: string;
  endDate?: string;
  type: 'planned' | 'unplanned';
  reason: 'maintenance' | 'technical' | 'operational' | 'regulatory' | 'force-majeure';
  deferredVolume: number;         // MMSCF/D
  cumulativeVolume: number;       // MMSCF
  status: 'ongoing' | 'resolved';
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NationalMetrics {
  date: string;
  totalProduction: number;        // MMSCF/D
  domesticSupply: number;         // MMSCF/D
  exportVolume: number;           // MMSCF/D
  flareVolume: number;            // MMSCF/D
  reinjectionVolume: number;      // MMSCF/D
  totalDemand: number;            // MMSCF/D
  powerSectorDemand: number;      // MMSCF/D
  industrialDemand: number;       // MMSCF/D
  domesticDemand: number;         // MMSCF/D
  balancingVolume: number;        // MMSCF/D
  dgoCompliance: number;          // percentage
  activeFacilities: number;
  totalFacilities: number;
  avgPipelinePressure: number;    // PSI
  avgUtilization: number;         // percentage
}

export interface Incident {
  id: string;
  facilityId: string;
  facilityName: string;
  operator: string;
  incidentDate: string;
  type: 'safety' | 'environmental' | 'operational' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  volumeLost?: number;            // MMSCF
  injuries?: number;
  fatalities?: number;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  investigator?: string;
  resolutionDate?: string;
  rootCause?: string;
  correctiveActions?: string;
  createdAt?: string;
  updatedAt?: string;
}
