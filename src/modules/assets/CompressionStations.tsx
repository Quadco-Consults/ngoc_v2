import { useState } from 'react';
import { Plus, Download, Upload, Gauge } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface CompressionStation {
  id: string;
  name: string;
  code: string;
  location: string;
  operator: string;
  numberOfCompressors: number;
  totalCapacity: number;
  currentThroughput: number;
  inletPressure: number;
  outletPressure: number;
  compressionRatio: number;
  powerRating: number;
  status: 'Operational' | 'Maintenance' | 'Standby' | 'Shutdown';
  efficiency: number;
  commissionDate: string;
  lastMaintenance?: string;
  description?: string;
}

// Mock data
const mockStations: CompressionStation[] = [
  {
    id: '1',
    name: 'Escravos Compression Station',
    code: 'ECS-01',
    location: 'Escravos, Delta State',
    operator: 'Shell Petroleum Development Company',
    numberOfCompressors: 4,
    totalCapacity: 800,
    currentThroughput: 720,
    inletPressure: 250,
    outletPressure: 950,
    compressionRatio: 3.8,
    powerRating: 25,
    status: 'Operational',
    efficiency: 92.5,
    commissionDate: '2015-06-15',
    lastMaintenance: '2024-01-10',
    description: 'Main compression facility for Escravos-Lagos pipeline',
  },
  {
    id: '2',
    name: 'Obite Compression Station',
    code: 'OCS-01',
    location: 'Obite, Rivers State',
    operator: 'Total E&P Nigeria',
    numberOfCompressors: 3,
    totalCapacity: 650,
    currentThroughput: 580,
    inletPressure: 280,
    outletPressure: 900,
    compressionRatio: 3.2,
    powerRating: 18,
    status: 'Operational',
    efficiency: 90.2,
    commissionDate: '2017-09-20',
    lastMaintenance: '2024-01-08',
    description: 'Boosts pressure for OB3 pipeline system',
  },
  {
    id: '3',
    name: 'Ajaokuta Compression Station',
    code: 'ACS-01',
    location: 'Ajaokuta, Kogi State',
    operator: 'Nigerian Gas Company',
    numberOfCompressors: 5,
    totalCapacity: 1200,
    currentThroughput: 0,
    inletPressure: 0,
    outletPressure: 0,
    compressionRatio: 4.0,
    powerRating: 35,
    status: 'Maintenance',
    efficiency: 0,
    commissionDate: '2023-03-15',
    lastMaintenance: '2024-01-15',
    description: 'Major compression facility for AKK pipeline project',
  },
  {
    id: '4',
    name: 'Utorogu Compression Station',
    code: 'UCS-01',
    location: 'Utorogu, Delta State',
    operator: 'NPDC',
    numberOfCompressors: 3,
    totalCapacity: 700,
    currentThroughput: 650,
    inletPressure: 300,
    outletPressure: 880,
    compressionRatio: 2.9,
    powerRating: 20,
    status: 'Operational',
    efficiency: 94.1,
    commissionDate: '2016-11-10',
    lastMaintenance: '2024-01-12',
    description: 'Supports Utorogu gas plant operations',
  },
];

export default function CompressionStations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<CompressionStation | null>(null);
  const [formData, setFormData] = useState<Partial<CompressionStation>>({});

  const itemsPerPage = 10;
  const filteredData = mockStations.filter(
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

  const totalCapacity = mockStations.reduce((sum, s) => sum + s.totalCapacity, 0);
  const operationalCount = mockStations.filter((s) => s.status === 'Operational').length;
  const avgEfficiency = (
    mockStations
      .filter((s) => s.status === 'Operational')
      .reduce((sum, s) => sum + s.efficiency, 0) / operationalCount
  ).toFixed(1);

  const handleAdd = () => {
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (station: CompressionStation) => {
    setSelectedStation(station);
    setFormData(station);
    setIsEditModalOpen(true);
  };

  const handleDelete = (station: CompressionStation) => {
    setSelectedStation(station);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (station: CompressionStation) => {
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
      header: 'Station Name',
      accessor: 'name' as keyof CompressionStation,
      render: (value: string, row: CompressionStation) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.code}</p>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'location' as keyof CompressionStation,
      render: (value: string, row: CompressionStation) => (
        <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.operator}</p>
        </div>
      ),
    },
    {
      header: 'Compressors',
      accessor: 'numberOfCompressors' as keyof CompressionStation,
    },
    {
      header: 'Capacity (MMSCF/D)',
      accessor: 'totalCapacity' as keyof CompressionStation,
      render: (value: number) => value.toLocaleString(),
    },
    {
      header: 'Throughput (MMSCF/D)',
      accessor: 'currentThroughput' as keyof CompressionStation,
      render: (value: number, row: CompressionStation) => (
        <div>
          <p className="font-medium">{value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">
            {((value / row.totalCapacity) * 100).toFixed(0)}% utilization
          </p>
        </div>
      ),
    },
    {
      header: 'Compression Ratio',
      accessor: 'compressionRatio' as keyof CompressionStation,
      render: (value: number) => `${value.toFixed(1)}:1`,
    },
    {
      header: 'Efficiency',
      accessor: 'efficiency' as keyof CompressionStation,
      render: (value: number) => (
        <span
          className={`font-medium ${
            value >= 90 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'
          }`}
        >
          {value > 0 ? `${value.toFixed(1)}%` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof CompressionStation,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Operational'
              ? 'bg-green-100 text-green-700'
              : value === 'Maintenance'
              ? 'bg-yellow-100 text-yellow-700'
              : value === 'Standby'
              ? 'bg-blue-100 text-blue-700'
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
        title="Compression Stations"
        subtitle="Gas compression facilities monitoring and management"
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
          title="Total Stations"
          value={mockStations.length}
          color="primary"
        />
        <StatsCard
          title="Operational Stations"
          value={operationalCount}
          color="success"
        />
        <StatsCard
          title="Total Capacity"
          value={`${totalCapacity.toLocaleString()} MMSCF/D`}
          color="secondary"
        />
        <StatsCard
          title="Average Efficiency"
          value={`${avgEfficiency}%`}
          icon={<Gauge className="w-6 h-6" />}
          color="accent"
          trend={{ value: 2.3, isPositive: true }}
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
        title="Add New Compression Station"
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
              label="Number of Compressors"
              type="number"
              required
              value={formData.numberOfCompressors || ''}
              onChange={(e) =>
                setFormData({ ...formData, numberOfCompressors: Number(e.target.value) })
              }
            />
            <InputField
              label="Total Capacity (MMSCF/D)"
              type="number"
              required
              value={formData.totalCapacity || ''}
              onChange={(e) =>
                setFormData({ ...formData, totalCapacity: Number(e.target.value) })
              }
            />
            <InputField
              label="Power Rating (MW)"
              type="number"
              required
              value={formData.powerRating || ''}
              onChange={(e) =>
                setFormData({ ...formData, powerRating: Number(e.target.value) })
              }
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CompressionStation['status'] })}
              options={[
                { value: 'Operational', label: 'Operational' },
                { value: 'Maintenance', label: 'Under Maintenance' },
                { value: 'Standby', label: 'Standby' },
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
        title="Edit Compression Station"
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
              label="Current Throughput (MMSCF/D)"
              type="number"
              value={formData.currentThroughput || ''}
              onChange={(e) =>
                setFormData({ ...formData, currentThroughput: Number(e.target.value) })
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CompressionStation['status'] })}
              options={[
                { value: 'Operational', label: 'Operational' },
                { value: 'Maintenance', label: 'Under Maintenance' },
                { value: 'Standby', label: 'Standby' },
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
        title="Delete Compression Station"
        message={`Are you sure you want to delete ${selectedStation?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
