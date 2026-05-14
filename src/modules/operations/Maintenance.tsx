import { useState } from 'react';
import { Plus, Download, Calendar, Wrench, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface MaintenanceRecord {
  id: string;
  facility: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Predictive' | 'Emergency';
  scheduledDate: string;
  completionDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  assignedTo: string;
  estimatedDuration: number;
  actualDuration?: number;
  cost?: number;
}

// Mock data
const mockMaintenance: MaintenanceRecord[] = [
  {
    id: '1',
    facility: 'Escravos Gas Plant - Train 2',
    maintenanceType: 'Preventive',
    scheduledDate: '2024-01-25',
    status: 'Scheduled',
    priority: 'High',
    description: 'Quarterly turbine inspection and servicing',
    assignedTo: 'Team Alpha',
    estimatedDuration: 48,
    cost: 2500000,
  },
  {
    id: '2',
    facility: 'AKK Pipeline Section B',
    maintenanceType: 'Corrective',
    scheduledDate: '2024-01-22',
    completionDate: '2024-01-23',
    status: 'Completed',
    priority: 'Critical',
    description: 'Pressure valve replacement',
    assignedTo: 'Team Bravo',
    estimatedDuration: 24,
    actualDuration: 26,
    cost: 1800000,
  },
  {
    id: '3',
    facility: 'Bonny LNG Terminal - Train 4',
    maintenanceType: 'Predictive',
    scheduledDate: '2024-01-20',
    status: 'Overdue',
    priority: 'High',
    description: 'Vibration analysis and bearing inspection',
    assignedTo: 'Team Charlie',
    estimatedDuration: 36,
  },
  {
    id: '4',
    facility: 'Utorogu Compression Station',
    maintenanceType: 'Preventive',
    scheduledDate: '2024-01-24',
    status: 'In Progress',
    priority: 'Medium',
    description: 'Routine compressor maintenance',
    assignedTo: 'Team Delta',
    estimatedDuration: 12,
  },
];

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({});

  const itemsPerPage = 10;
  const filteredData = mockMaintenance.filter((record) =>
    record.facility.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scheduledCount = mockMaintenance.filter((r) => r.status === 'Scheduled').length;
  const overdueCount = mockMaintenance.filter((r) => r.status === 'Overdue').length;
  const inProgressCount = mockMaintenance.filter((r) => r.status === 'In Progress').length;
  const completedThisMonth = mockMaintenance.filter((r) => r.status === 'Completed').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit maintenance:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Scheduled Date',
      accessor: 'scheduledDate' as keyof MaintenanceRecord,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Facility',
      accessor: 'facility' as keyof MaintenanceRecord,
      render: (value: string, row: MaintenanceRecord) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.maintenanceType} Maintenance</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description' as keyof MaintenanceRecord,
      render: (value: string) => (
        <p className="text-sm text-gray-700 truncate max-w-xs">{value}</p>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo' as keyof MaintenanceRecord,
    },
    {
      header: 'Duration (hrs)',
      accessor: 'estimatedDuration' as keyof MaintenanceRecord,
      render: (value: number, row: MaintenanceRecord) =>
        row.actualDuration ? `${row.actualDuration} / ${value}` : value,
    },
    {
      header: 'Priority',
      accessor: 'priority' as keyof MaintenanceRecord,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Critical'
              ? 'bg-red-100 text-red-700'
              : value === 'High'
              ? 'bg-orange-100 text-orange-700'
              : value === 'Medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof MaintenanceRecord,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Completed'
              ? 'bg-green-100 text-green-700'
              : value === 'In Progress'
              ? 'bg-blue-100 text-blue-700'
              : value === 'Overdue'
              ? 'bg-red-100 text-red-700'
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
        title="Maintenance Schedule"
        subtitle="Asset maintenance planning and tracking"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export Schedule
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Schedule Maintenance
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Scheduled"
          value={scheduledCount}
          icon={<Calendar className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="In Progress"
          value={inProgressCount}
          icon={<Wrench className="w-6 h-6" />}
          color="accent"
        />
        <StatsCard
          title="Overdue"
          value={overdueCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="danger"
        />
        <StatsCard
          title="Completed (This Month)"
          value={completedThisMonth}
          color="success"
        />
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Overdue Maintenance Alert</h4>
              <p className="text-sm text-red-800 mt-1">
                {overdueCount} maintenance task{overdueCount > 1 ? 's are' : ' is'} overdue.
                Please review and reschedule immediately to avoid operational risks.
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
          placeholder="Search by facility name..."
        />
      </div>

      {/* Table */}
      <TableComponent
        data={paginatedData}
        columns={columns}
        actions={[
          {
            label: 'View Details',
            onClick: (row) => console.log('View', row),
            variant: 'primary',
          },
          { label: 'Edit', onClick: (row) => console.log('Edit', row), variant: 'outline' },
          {
            label: 'Mark Complete',
            onClick: (row) => console.log('Complete', row),
            variant: 'outline',
          },
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
        title="Schedule Maintenance"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Facility"
              required
              value={formData.facility || ''}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
            />
            <SelectField
              label="Maintenance Type"
              required
              value={formData.maintenanceType || ''}
              onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
              options={[
                { value: 'Preventive', label: 'Preventive' },
                { value: 'Corrective', label: 'Corrective' },
                { value: 'Predictive', label: 'Predictive' },
                { value: 'Emergency', label: 'Emergency' },
              ]}
            />
            <InputField
              label="Scheduled Date"
              type="date"
              required
              value={formData.scheduledDate || ''}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
            <SelectField
              label="Priority"
              required
              value={formData.priority || ''}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'Critical', label: 'Critical' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
            />
            <InputField
              label="Assigned To"
              required
              value={formData.assignedTo || ''}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
            <InputField
              label="Estimated Duration (hours)"
              type="number"
              required
              value={formData.estimatedDuration || ''}
              onChange={(e) =>
                setFormData({ ...formData, estimatedDuration: Number(e.target.value) })
              }
            />
            <InputField
              label="Estimated Cost (₦)"
              type="number"
              value={formData.cost || ''}
              onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            />
          </div>
          <TextAreaField
            label="Description"
            required
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
