import { useState } from 'react';
import { Plus, Download, Upload, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface LNGTerminal {
  id: string;
  name: string;
  code: string;
  location: string;
  operator: string;
  numberOfTrains: number;
  totalCapacity: number;
  currentProduction: number;
  status: 'Operational' | 'Maintenance' | 'Shutdown';
  storageCapacity: number;
  exportDestinations: string;
  commissionDate: string;
  lastMaintenance?: string;
}

// Mock data
const mockTerminals: LNGTerminal[] = [
  {
    id: '1',
    name: 'Bonny Island LNG Terminal',
    code: 'BNYLNG-01',
    location: 'Bonny Island, Rivers State',
    operator: 'Nigeria LNG Limited',
    numberOfTrains: 6,
    totalCapacity: 22000,
    currentProduction: 21500,
    status: 'Operational',
    storageCapacity: 450000,
    exportDestinations: 'Europe, Asia, Americas',
    commissionDate: '1999-10-09',
    lastMaintenance: '2024-01-15',
  },
  {
    id: '2',
    name: 'Brass LNG Terminal',
    code: 'BRSLNG-01',
    location: 'Brass Island, Bayelsa State',
    operator: 'Brass LNG Limited',
    numberOfTrains: 2,
    totalCapacity: 5000,
    currentProduction: 0,
    status: 'Shutdown',
    storageCapacity: 180000,
    exportDestinations: 'Europe, West Africa',
    commissionDate: '2025-06-01',
  },
  {
    id: '3',
    name: 'OK LNG Terminal',
    code: 'OKLNG-01',
    location: 'Okpobo, Akwa Ibom State',
    operator: 'OK LNG Company',
    numberOfTrains: 2,
    totalCapacity: 6000,
    currentProduction: 5800,
    status: 'Operational',
    storageCapacity: 200000,
    exportDestinations: 'Europe, Asia',
    commissionDate: '2021-03-15',
    lastMaintenance: '2024-01-10',
  },
];

export default function LNGTerminals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<LNGTerminal | null>(null);
  const [formData, setFormData] = useState<Partial<LNGTerminal>>({});

  const itemsPerPage = 10;
  const filteredData = mockTerminals.filter(
    (terminal) =>
      terminal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCapacity = mockTerminals.reduce((sum, t) => sum + t.totalCapacity, 0);
  const totalProduction = mockTerminals.reduce((sum, t) => sum + t.currentProduction, 0);
  const operationalCount = mockTerminals.filter((t) => t.status === 'Operational').length;

  const handleAdd = () => {
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (terminal: LNGTerminal) => {
    setSelectedTerminal(terminal);
    setFormData(terminal);
    setIsEditModalOpen(true);
  };

  const handleDelete = (terminal: LNGTerminal) => {
    setSelectedTerminal(terminal);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (terminal: LNGTerminal) => {
    console.log('View terminal:', terminal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit terminal:', formData);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    console.log('Delete terminal:', selectedTerminal);
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      header: 'Terminal Name',
      accessor: 'name' as keyof LNGTerminal,
      render: (value: string, row: LNGTerminal) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.code}</p>
        </div>
      ),
    },
    {
      header: 'Operator',
      accessor: 'operator' as keyof LNGTerminal,
    },
    {
      header: 'Location',
      accessor: 'location' as keyof LNGTerminal,
    },
    {
      header: 'Trains',
      accessor: 'numberOfTrains' as keyof LNGTerminal,
    },
    {
      header: 'Capacity (MTPA)',
      accessor: 'totalCapacity' as keyof LNGTerminal,
      render: (value: number) => (value / 1000).toFixed(1),
    },
    {
      header: 'Production (MTPA)',
      accessor: 'currentProduction' as keyof LNGTerminal,
      render: (value: number, row: LNGTerminal) => (
        <div>
          <p className="font-medium">{(value / 1000).toFixed(1)}</p>
          <p className="text-xs text-gray-500">
            {((value / row.totalCapacity) * 100).toFixed(0)}% utilization
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof LNGTerminal,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Operational'
              ? 'bg-green-100 text-green-700'
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
        title="LNG Terminals"
        subtitle="Liquefied Natural Gas terminal management and monitoring"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd}>
              Add Terminal
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Terminals"
          value={mockTerminals.length}
          color="primary"
        />
        <StatsCard
          title="Operational Terminals"
          value={operationalCount}
          color="success"
        />
        <StatsCard
          title="Total Capacity"
          value={`${(totalCapacity / 1000).toFixed(1)} MTPA`}
          color="secondary"
        />
        <StatsCard
          title="Current Production"
          value={`${(totalProduction / 1000).toFixed(1)} MTPA`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="accent"
          trend={{ value: 3.5, isPositive: true }}
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by name, code, or operator..."
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
        title="Add New LNG Terminal"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Terminal Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              label="Terminal Code"
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
              label="Number of Trains"
              type="number"
              required
              value={formData.numberOfTrains || ''}
              onChange={(e) =>
                setFormData({ ...formData, numberOfTrains: Number(e.target.value) })
              }
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LNGTerminal['status'] })}
              options={[
                { value: 'Operational', label: 'Operational' },
                { value: 'Maintenance', label: 'Under Maintenance' },
                { value: 'Shutdown', label: 'Shutdown' },
              ]}
            />
            <InputField
              label="Total Capacity (MTPA)"
              type="number"
              required
              value={formData.totalCapacity || ''}
              onChange={(e) =>
                setFormData({ ...formData, totalCapacity: Number(e.target.value) })
              }
            />
            <InputField
              label="Current Production (MTPA)"
              type="number"
              value={formData.currentProduction || ''}
              onChange={(e) =>
                setFormData({ ...formData, currentProduction: Number(e.target.value) })
              }
            />
            <InputField
              label="Storage Capacity (m³)"
              type="number"
              value={formData.storageCapacity || ''}
              onChange={(e) =>
                setFormData({ ...formData, storageCapacity: Number(e.target.value) })
              }
            />
            <InputField
              label="Commission Date"
              type="date"
              value={formData.commissionDate || ''}
              onChange={(e) => setFormData({ ...formData, commissionDate: e.target.value })}
            />
          </div>
          <InputField
            label="Export Destinations"
            value={formData.exportDestinations || ''}
            onChange={(e) => setFormData({ ...formData, exportDestinations: e.target.value })}
          />
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
              Add Terminal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit LNG Terminal"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Terminal Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              label="Terminal Code"
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
              label="Number of Trains"
              type="number"
              required
              value={formData.numberOfTrains || ''}
              onChange={(e) =>
                setFormData({ ...formData, numberOfTrains: Number(e.target.value) })
              }
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LNGTerminal['status'] })}
              options={[
                { value: 'Operational', label: 'Operational' },
                { value: 'Maintenance', label: 'Under Maintenance' },
                { value: 'Shutdown', label: 'Shutdown' },
              ]}
            />
            <InputField
              label="Total Capacity (MTPA)"
              type="number"
              required
              value={formData.totalCapacity || ''}
              onChange={(e) =>
                setFormData({ ...formData, totalCapacity: Number(e.target.value) })
              }
            />
            <InputField
              label="Current Production (MTPA)"
              type="number"
              value={formData.currentProduction || ''}
              onChange={(e) =>
                setFormData({ ...formData, currentProduction: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Terminal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete LNG Terminal"
        message={`Are you sure you want to delete ${selectedTerminal?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
