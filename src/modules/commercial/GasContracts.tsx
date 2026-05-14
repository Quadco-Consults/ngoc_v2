import { useState } from 'react';
import { Plus, Download, Upload, FileText, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface GasContract {
  id: string;
  contractNumber: string;
  contractName: string;
  supplier: string;
  buyer: string;
  contractType: 'GSA' | 'GSPA' | 'Take-or-Pay' | 'Interruptible';
  sector: 'Power' | 'Industrial' | 'Domestic' | 'Export';
  contractedVolume: number;
  dailyContractQuantity: number;
  price: number;
  startDate: string;
  endDate: string;
  remainingDays: number;
  deliveryPoint: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Suspended';
  compliance: number;
  notes?: string;
}

// Mock data
const mockContracts: GasContract[] = [
  {
    id: '1',
    contractNumber: 'GSA-2024-001',
    contractName: 'Egbin Power Station GSA',
    supplier: 'NNPC Gas Marketing',
    buyer: 'Egbin Power Plc',
    contractType: 'GSA',
    sector: 'Power',
    contractedVolume: 65700,
    dailyContractQuantity: 180,
    price: 2.50,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    remainingDays: 344,
    deliveryPoint: 'Escravos Hub',
    status: 'Active',
    compliance: 97.2,
    notes: 'Long-term power sector supply agreement',
  },
  {
    id: '2',
    contractNumber: 'GSPA-2023-045',
    contractName: 'Dangote Industries GSPA',
    supplier: 'Shell Gas Direct',
    buyer: 'Dangote Industries Limited',
    contractType: 'GSPA',
    sector: 'Industrial',
    contractedVolume: 43800,
    dailyContractQuantity: 120,
    price: 3.20,
    startDate: '2023-06-01',
    endDate: '2025-05-31',
    remainingDays: 496,
    deliveryPoint: 'Bonny Terminal',
    status: 'Active',
    compliance: 98.5,
    notes: 'Premium industrial gas supply',
  },
  {
    id: '3',
    contractNumber: 'TOP-2024-012',
    contractName: 'NLNG Take-or-Pay Contract',
    supplier: 'NPDC',
    buyer: 'Nigeria LNG Limited',
    contractType: 'Take-or-Pay',
    sector: 'Export',
    contractedVolume: 73000,
    dailyContractQuantity: 200,
    price: 2.80,
    startDate: '2024-01-01',
    endDate: '2029-12-31',
    remainingDays: 2189,
    deliveryPoint: 'Bonny LNG',
    status: 'Active',
    compliance: 99.1,
    notes: 'Long-term LNG feedgas supply',
  },
  {
    id: '4',
    contractNumber: 'INT-2024-008',
    contractName: 'Lagos Gas Interruptible Supply',
    supplier: 'Gaslink Nigeria',
    buyer: 'Lagos Gas Company',
    contractType: 'Interruptible',
    sector: 'Domestic',
    contractedVolume: 16425,
    dailyContractQuantity: 45,
    price: 3.50,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    remainingDays: 344,
    deliveryPoint: 'Utorogu Station',
    status: 'Active',
    compliance: 92.8,
    notes: 'Interruptible domestic supply',
  },
  {
    id: '5',
    contractNumber: 'GSA-2023-089',
    contractName: 'Omotosho Power GSA',
    supplier: 'NNPC Gas Marketing',
    buyer: 'NEPL Omotosho',
    contractType: 'GSA',
    sector: 'Power',
    contractedVolume: 23725,
    dailyContractQuantity: 65,
    price: 2.50,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    remainingDays: -21,
    deliveryPoint: 'Escravos-Omotosho',
    status: 'Expired',
    compliance: 95.6,
    notes: 'Contract expired, renewal pending',
  },
];

export default function GasContracts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<GasContract | null>(null);
  const [formData, setFormData] = useState<Partial<GasContract>>({});

  const itemsPerPage = 10;
  const filteredData = mockContracts.filter(
    (contract) =>
      contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.buyer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeContracts = mockContracts.filter((c) => c.status === 'Active').length;
  const totalContractedVolume = mockContracts
    .filter((c) => c.status === 'Active')
    .reduce((sum, c) => sum + c.contractedVolume, 0);
  const expiringContracts = mockContracts.filter(
    (c) => c.status === 'Active' && c.remainingDays <= 90
  ).length;
  const avgCompliance = (
    mockContracts
      .filter((c) => c.status === 'Active')
      .reduce((sum, c) => sum + c.compliance, 0) / activeContracts
  ).toFixed(1);

  const handleAdd = () => {
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (contract: GasContract) => {
    setSelectedContract(contract);
    setFormData(contract);
    setIsEditModalOpen(true);
  };

  const handleDelete = (contract: GasContract) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (contract: GasContract) => {
    console.log('View contract:', contract);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit contract:', formData);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    console.log('Delete contract:', selectedContract);
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      header: 'Contract',
      accessor: 'contractNumber' as keyof GasContract,
      render: (value: string, row: GasContract) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.contractName}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'contractType' as keyof GasContract,
      render: (value: string, row: GasContract) => (
        <div>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {value}
          </span>
          <p className="text-xs text-gray-500 mt-1">{row.sector}</p>
        </div>
      ),
    },
    {
      header: 'Buyer',
      accessor: 'buyer' as keyof GasContract,
      render: (value: string, row: GasContract) => (
        <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">Supplier: {row.supplier}</p>
        </div>
      ),
    },
    {
      header: 'DCQ (MMSCF/D)',
      accessor: 'dailyContractQuantity' as keyof GasContract,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Price ($/MMBTU)',
      accessor: 'price' as keyof GasContract,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      header: 'Period',
      accessor: 'startDate' as keyof GasContract,
      render: (value: string, row: GasContract) => (
        <div>
          <p className="text-xs text-gray-700">
            {new Date(value).toLocaleDateString()} -
          </p>
          <p className="text-xs text-gray-700">
            {new Date(row.endDate).toLocaleDateString()}
          </p>
          <p className={`text-xs mt-1 ${row.remainingDays <= 90 && row.status === 'Active' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {row.remainingDays > 0 ? `${row.remainingDays} days left` : 'Expired'}
          </p>
        </div>
      ),
    },
    {
      header: 'Compliance',
      accessor: 'compliance' as keyof GasContract,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                value >= 95 ? 'bg-green-500' : value >= 90 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs">{value.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasContract,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Active'
              ? 'bg-green-100 text-green-700'
              : value === 'Expired'
              ? 'bg-red-100 text-red-700'
              : value === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gas Contracts"
        subtitle="Gas supply agreement and contract management"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd}>
              New Contract
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Active Contracts"
          value={activeContracts}
          icon={<FileText className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="Total DCQ"
          value={`${totalContractedVolume.toLocaleString()} MMSCF/Y`}
          color="secondary"
        />
        <StatsCard
          title="Avg Compliance"
          value={`${avgCompliance}%`}
          color="success"
        />
        <StatsCard
          title="Expiring Soon"
          value={expiringContracts}
          icon={<AlertCircle className="w-6 h-6" />}
          color="warning"
        />
      </div>

      {/* Alerts */}
      {expiringContracts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Contract Expiry Alert</h4>
              <p className="text-sm text-yellow-800 mt-1">
                {expiringContracts} contract{expiringContracts > 1 ? 's are' : ' is'} expiring within
                90 days. Please initiate renewal discussions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by contract number, name, or buyer..."
        />
      </div>

      {/* Table */}
      <TableComponent
        data={paginatedData}
        columns={columns}
        onRowClick={handleView}
        actions={[
          { label: 'View Details', onClick: handleView, variant: 'primary' },
          { label: 'Edit', onClick: handleEdit, variant: 'outline' },
          { label: 'Terminate', onClick: handleDelete, variant: 'danger' },
        ]}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Gas Contract"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Contract Number"
              required
              value={formData.contractNumber || ''}
              onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
            />
            <InputField
              label="Contract Name"
              required
              value={formData.contractName || ''}
              onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
            />
            <InputField
              label="Supplier"
              required
              value={formData.supplier || ''}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
            <InputField
              label="Buyer"
              required
              value={formData.buyer || ''}
              onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
            />
            <SelectField
              label="Contract Type"
              required
              value={formData.contractType || ''}
              onChange={(e) => setFormData({ ...formData, contractType: e.target.value as GasContract['contractType'] })}
              options={[
                { value: 'GSA', label: 'Gas Sales Agreement (GSA)' },
                { value: 'GSPA', label: 'Gas Sales & Purchase Agreement (GSPA)' },
                { value: 'Take-or-Pay', label: 'Take-or-Pay' },
                { value: 'Interruptible', label: 'Interruptible Supply' },
              ]}
            />
            <SelectField
              label="Sector"
              required
              value={formData.sector || ''}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value as GasContract['sector'] })}
              options={[
                { value: 'Power', label: 'Power Sector' },
                { value: 'Industrial', label: 'Industrial' },
                { value: 'Domestic', label: 'Domestic' },
                { value: 'Export', label: 'Export (LNG)' },
              ]}
            />
            <InputField
              label="Daily Contract Quantity (MMSCF/D)"
              type="number"
              required
              value={formData.dailyContractQuantity || ''}
              onChange={(e) =>
                setFormData({ ...formData, dailyContractQuantity: Number(e.target.value) })
              }
            />
            <InputField
              label="Price ($/MMBTU)"
              type="number"
              step="0.01"
              required
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
            <InputField
              label="Start Date"
              type="date"
              required
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <InputField
              label="End Date"
              type="date"
              required
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <InputField
              label="Delivery Point"
              required
              value={formData.deliveryPoint || ''}
              onChange={(e) => setFormData({ ...formData, deliveryPoint: e.target.value })}
            />
          </div>
          <TextAreaField
            label="Notes"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Contract
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Gas Contract"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Contract Number"
              required
              value={formData.contractNumber || ''}
              onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
            />
            <InputField
              label="Contract Name"
              required
              value={formData.contractName || ''}
              onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
            />
            <InputField
              label="Compliance (%)"
              type="number"
              step="0.1"
              value={formData.compliance || ''}
              onChange={(e) => setFormData({ ...formData, compliance: Number(e.target.value) })}
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as GasContract['status'] })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Expired', label: 'Expired' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Suspended', label: 'Suspended' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Contract
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Terminate Contract"
        message={`Are you sure you want to terminate ${selectedContract?.contractNumber}? This action cannot be undone.`}
        confirmText="Terminate"
        variant="danger"
      />
    </div>
  );
}
