import { useState } from 'react';
import { Plus, Download, Upload, Zap } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface PowerStation {
  id: string;
  name: string;
  code: string;
  location: string;
  operator: string;
  installedCapacity: number;
  currentGeneration: number;
  gasConsumption: number;
  numberOfUnits: number;
  efficiency: number;
  status: 'Operational' | 'Partial' | 'Maintenance' | 'Shutdown';
  fuelType: 'Natural Gas' | 'Dual Fuel' | 'Combined Cycle';
  commissionDate: string;
  lastMaintenance?: string;
  description?: string;
}

// Mock data
const mockPowerStations: PowerStation[] = [
  {
    id: '1',
    name: 'Egbin Power Station',
    code: 'EPS-01',
    location: 'Ijede, Lagos State',
    operator: 'Sahara Power Group',
    installedCapacity: 1320,
    currentGeneration: 1180,
    gasConsumption: 180,
    numberOfUnits: 6,
    efficiency: 42.5,
    status: 'Operational',
    fuelType: 'Natural Gas',
    commissionDate: '1985-09-15',
    lastMaintenance: '2024-01-05',
    description: 'Largest thermal power station in Nigeria',
  },
  {
    id: '2',
    name: 'Omotosho Power Station',
    code: 'OPS-01',
    location: 'Ondo State',
    operator: 'NEPL Omotosho Power Company',
    installedCapacity: 450,
    currentGeneration: 380,
    gasConsumption: 65,
    numberOfUnits: 3,
    efficiency: 38.2,
    status: 'Operational',
    fuelType: 'Natural Gas',
    commissionDate: '2012-06-20',
    lastMaintenance: '2024-01-12',
    description: 'Gas-fired thermal power plant in Ondo',
  },
  {
    id: '3',
    name: 'Calabar Power Station',
    code: 'CPS-01',
    location: 'Cross River State',
    operator: 'Geometric Power Limited',
    installedCapacity: 561,
    currentGeneration: 0,
    gasConsumption: 0,
    numberOfUnits: 3,
    efficiency: 0,
    status: 'Shutdown',
    fuelType: 'Combined Cycle',
    commissionDate: '2017-03-10',
    lastMaintenance: '2023-12-15',
    description: 'Combined cycle gas turbine power plant',
  },
  {
    id: '4',
    name: 'Azura-Edo IPP',
    code: 'AZR-01',
    location: 'Edo State',
    operator: 'Azura Power West Africa',
    installedCapacity: 461,
    currentGeneration: 450,
    gasConsumption: 78,
    numberOfUnits: 3,
    efficiency: 45.8,
    status: 'Operational',
    fuelType: 'Combined Cycle',
    commissionDate: '2018-09-25',
    lastMaintenance: '2024-01-08',
    description: 'First Independent Power Plant in Nigeria',
  },
  {
    id: '5',
    name: 'Afam VI Power Station',
    code: 'AFM-06',
    location: 'Rivers State',
    operator: 'Shell/SPDC',
    installedCapacity: 624,
    currentGeneration: 520,
    gasConsumption: 95,
    numberOfUnits: 4,
    efficiency: 40.1,
    status: 'Partial',
    fuelType: 'Natural Gas',
    commissionDate: '2008-11-30',
    lastMaintenance: '2024-01-10',
    description: 'Major gas-fired power station in Port Harcourt',
  },
];

export default function PowerStations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<PowerStation | null>(null);
  const [formData, setFormData] = useState<Partial<PowerStation>>({});

  const itemsPerPage = 10;
  const filteredData = mockPowerStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCapacity = mockPowerStations.reduce((sum, s) => sum + s.installedCapacity, 0);
  const totalGeneration = mockPowerStations.reduce((sum, s) => sum + s.currentGeneration, 0);
  const totalGasConsumption = mockPowerStations.reduce((sum, s) => sum + s.gasConsumption, 0);
  const operationalCount = mockPowerStations.filter((s) => s.status === 'Operational').length;
  const avgEfficiency = (
    mockPowerStations
      .filter((s) => s.status === 'Operational')
      .reduce((sum, s) => sum + s.efficiency, 0) / operationalCount
  ).toFixed(1);

  const handleAdd = () => {
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (station: PowerStation) => {
    setSelectedStation(station);
    setFormData(station);
    setIsEditModalOpen(true);
  };

  const handleDelete = (station: PowerStation) => {
    setSelectedStation(station);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (station: PowerStation) => {
    console.log('View station:', station);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit station:', formData);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    console.log('Delete station:', selectedStation);
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      header: 'Power Station',
      accessor: 'name' as keyof PowerStation,
      render: (value: string, row: PowerStation) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.code}</p>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'location' as keyof PowerStation,
      render: (value: string, row: PowerStation) => (
        <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.operator}</p>
        </div>
      ),
    },
    {
      header: 'Capacity (MW)',
      accessor: 'installedCapacity' as keyof PowerStation,
      render: (value: number) => value.toLocaleString(),
    },
    {
      header: 'Generation (MW)',
      accessor: 'currentGeneration' as keyof PowerStation,
      render: (value: number, row: PowerStation) => (
        <div>
          <p className="font-medium">{value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">
            {((value / row.installedCapacity) * 100).toFixed(0)}% load factor
          </p>
        </div>
      ),
    },
    {
      header: 'Gas Consumption',
      accessor: 'gasConsumption' as keyof PowerStation,
      render: (value: number) => `${value} MMSCF/D`,
    },
    {
      header: 'Efficiency',
      accessor: 'efficiency' as keyof PowerStation,
      render: (value: number) => (
        <span
          className={`font-medium ${
            value >= 40 ? 'text-green-600' : value >= 35 ? 'text-yellow-600' : 'text-red-600'
          }`}
        >
          {value > 0 ? `${value.toFixed(1)}%` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Fuel Type',
      accessor: 'fuelType' as keyof PowerStation,
      render: (value: string) => (
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof PowerStation,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Operational'
              ? 'bg-green-100 text-green-700'
              : value === 'Partial'
              ? 'bg-blue-100 text-blue-700'
              : value === 'Maintenance'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
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
        title="Power Stations"
        subtitle="Gas-fired power generation facilities monitoring"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd}>
              Add Station
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Capacity"
          value={`${totalCapacity.toLocaleString()} MW`}
          icon={<Zap className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="Current Generation"
          value={`${totalGeneration.toLocaleString()} MW`}
          color="success"
          trend={{ value: 4.2, isPositive: true }}
        />
        <StatsCard
          title="Gas Consumption"
          value={`${totalGasConsumption} MMSCF/D`}
          color="secondary"
        />
        <StatsCard
          title="Average Efficiency"
          value={`${avgEfficiency}%`}
          color="accent"
          trend={{ value: 1.5, isPositive: true }}
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by name, code, or location..."
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
          { label: 'Delete', onClick: handleDelete, variant: 'danger' },
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
        title="Add New Power Station"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Station Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              label="Station Code"
              required
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <InputField
              label="Location"
              required
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <InputField
              label="Operator"
              required
              value={formData.operator || ''}
              onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
            />
            <InputField
              label="Installed Capacity (MW)"
              type="number"
              required
              value={formData.installedCapacity || ''}
              onChange={(e) =>
                setFormData({ ...formData, installedCapacity: Number(e.target.value) })
              }
            />
            <InputField
              label="Number of Units"
              type="number"
              required
              value={formData.numberOfUnits || ''}
              onChange={(e) =>
                setFormData({ ...formData, numberOfUnits: Number(e.target.value) })
              }
            />
            <SelectField
              label="Fuel Type"
              required
              value={formData.fuelType || ''}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              options={[
                { value: 'Natural Gas', label: 'Natural Gas' },
                { value: 'Dual Fuel', label: 'Dual Fuel' },
                { value: 'Combined Cycle', label: 'Combined Cycle' },
              ]}
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Operational', label: 'Operational' },
                { value: 'Partial', label: 'Partial Operation' },
                { value: 'Maintenance', label: 'Under Maintenance' },
                { value: 'Shutdown', label: 'Shutdown' },
              ]}
            />
            <InputField
              label="Commission Date"
              type="date"
              value={formData.commissionDate || ''}
              onChange={(e) => setFormData({ ...formData, commissionDate: e.target.value })}
            />
          </div>
          <TextAreaField
            label="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Station
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Power Station"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Station Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              label="Station Code"
              required
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <InputField
              label="Current Generation (MW)"
              type="number"
              value={formData.currentGeneration || ''}
              onChange={(e) =>
                setFormData({ ...formData, currentGeneration: Number(e.target.value) })
              }
            />
            <InputField
              label="Gas Consumption (MMSCF/D)"
              type="number"
              value={formData.gasConsumption || ''}
              onChange={(e) =>
                setFormData({ ...formData, gasConsumption: Number(e.target.value) })
              }
            />
            <InputField
              label="Efficiency (%)"
              type="number"
              step="0.1"
              value={formData.efficiency || ''}
              onChange={(e) =>
                setFormData({ ...formData, efficiency: Number(e.target.value) })
              }
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Operational', label: 'Operational' },
                { value: 'Partial', label: 'Partial Operation' },
                { value: 'Maintenance', label: 'Under Maintenance' },
                { value: 'Shutdown', label: 'Shutdown' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Station
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Power Station"
        message={`Are you sure you want to delete ${selectedStation?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
