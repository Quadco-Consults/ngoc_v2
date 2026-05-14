import { useState } from 'react';
import { Plus, Download, TrendingDown, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Deferment {
  id: string;
  defermentDate: string;
  facility: string;
  defermentType: 'Planned' | 'Unplanned' | 'Force Majeure';
  reason: string;
  deferredVolume: number;
  duration: number;
  status: 'Active' | 'Resolved' | 'Ongoing';
  severity: 'High' | 'Medium' | 'Low';
  reportedBy: string;
  estimatedLoss: number;
  resolutionDate?: string;
}

// Mock data
const mockDeferments: Deferment[] = [
  {
    id: '1',
    defermentDate: '2024-01-21',
    facility: 'Escravos Gas Plant - Train 2',
    defermentType: 'Planned',
    reason: 'Scheduled maintenance shutdown',
    deferredVolume: 120,
    duration: 48,
    status: 'Active',
    severity: 'Medium',
    reportedBy: 'Operations Manager',
    estimatedLoss: 5600000,
  },
  {
    id: '2',
    defermentDate: '2024-01-20',
    facility: 'Obiafu-Obrikom Field',
    defermentType: 'Unplanned',
    reason: 'Compressor failure',
    deferredVolume: 85,
    duration: 24,
    status: 'Resolved',
    severity: 'High',
    reportedBy: 'Field Engineer',
    estimatedLoss: 2040000,
    resolutionDate: '2024-01-21',
  },
  {
    id: '3',
    defermentDate: '2024-01-19',
    facility: 'AKK Pipeline Section B',
    defermentType: 'Force Majeure',
    reason: 'Community interference',
    deferredVolume: 200,
    duration: 72,
    status: 'Ongoing',
    severity: 'High',
    reportedBy: 'Security Team',
    estimatedLoss: 14400000,
  },
  {
    id: '4',
    defermentDate: '2024-01-18',
    facility: 'Utorogu Station',
    defermentType: 'Unplanned',
    reason: 'Power supply interruption',
    deferredVolume: 45,
    duration: 12,
    status: 'Resolved',
    severity: 'Low',
    reportedBy: 'Station Operator',
    estimatedLoss: 540000,
    resolutionDate: '2024-01-19',
  },
];

const trendData = [
  { month: 'Aug', volume: 450 },
  { month: 'Sep', volume: 380 },
  { month: 'Oct', volume: 520 },
  { month: 'Nov', volume: 410 },
  { month: 'Dec', volume: 480 },
  { month: 'Jan', volume: 450 },
];

export default function Deferments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Deferment>>({});

  const itemsPerPage = 10;
  const filteredData = mockDeferments.filter((record) =>
    record.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalDeferred = mockDeferments.reduce((sum, d) => sum + d.deferredVolume, 0);
  const totalLoss = mockDeferments.reduce((sum, d) => sum + d.estimatedLoss, 0);
  const activeCount = mockDeferments.filter((d) => d.status === 'Active' || d.status === 'Ongoing').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit deferment:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'defermentDate' as keyof Deferment,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Facility',
      accessor: 'facility' as keyof Deferment,
      render: (value: string, row: Deferment) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.defermentType}</p>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessor: 'reason' as keyof Deferment,
      render: (value: string) => (
        <p className="text-sm text-gray-700 truncate max-w-xs">{value}</p>
      ),
    },
    {
      header: 'Deferred (MMSCF/D)',
      accessor: 'deferredVolume' as keyof Deferment,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Duration (hrs)',
      accessor: 'duration' as keyof Deferment,
    },
    {
      header: 'Est. Loss (₦)',
      accessor: 'estimatedLoss' as keyof Deferment,
      render: (value: number) => `₦${(value / 1000000).toFixed(1)}M`,
    },
    {
      header: 'Severity',
      accessor: 'severity' as keyof Deferment,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'High'
              ? 'bg-red-100 text-red-700'
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
      accessor: 'status' as keyof Deferment,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Resolved'
              ? 'bg-green-100 text-green-700'
              : value === 'Active'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-orange-100 text-orange-700'
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
        title="Production Deferments"
        subtitle="Track and manage production loss events"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Report Deferment
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Deferred"
          value={totalDeferred.toFixed(0)}
          subtitle="MMSCF/D"
          icon={<TrendingDown className="w-6 h-6" />}
          color="warning"
        />
        <StatsCard
          title="Estimated Loss"
          value={`₦${(totalLoss / 1000000).toFixed(1)}M`}
          color="danger"
        />
        <StatsCard
          title="Active Deferments"
          value={activeCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="accent"
        />
        <StatsCard
          title="Avg Resolution Time"
          value="28 hours"
          color="success"
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Deferment Trend (Last 6 Months) - MMSCF/D
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#EF4444"
              strokeWidth={2}
              name="Deferred Volume"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active Deferments Alert */}
      {activeCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900">Active Production Deferments</h4>
              <p className="text-sm text-orange-800 mt-1">
                {activeCount} deferment{activeCount > 1 ? 's are' : ' is'} currently affecting
                production. Total volume deferred:{' '}
                {mockDeferments
                  .filter((d) => d.status === 'Active' || d.status === 'Ongoing')
                  .reduce((sum, d) => sum + d.deferredVolume, 0)
                  .toFixed(0)}{' '}
                MMSCF/D
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
          placeholder="Search by facility or reason..."
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
          { label: 'Update', onClick: (row) => console.log('Update', row), variant: 'outline' },
          {
            label: 'Mark Resolved',
            onClick: (row) => console.log('Resolve', row),
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
        title="Report Production Deferment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Deferment Date"
              type="date"
              required
              value={formData.defermentDate || ''}
              onChange={(e) => setFormData({ ...formData, defermentDate: e.target.value })}
            />
            <InputField
              label="Facility"
              required
              value={formData.facility || ''}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
            />
            <SelectField
              label="Deferment Type"
              required
              value={formData.defermentType || ''}
              onChange={(e) => setFormData({ ...formData, defermentType: e.target.value as Deferment['defermentType'] })}
              options={[
                { value: 'Planned', label: 'Planned' },
                { value: 'Unplanned', label: 'Unplanned' },
                { value: 'Force Majeure', label: 'Force Majeure' },
              ]}
            />
            <SelectField
              label="Severity"
              required
              value={formData.severity || ''}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as Deferment['severity'] })}
              options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
            />
            <InputField
              label="Deferred Volume (MMSCF/D)"
              type="number"
              required
              value={formData.deferredVolume || ''}
              onChange={(e) =>
                setFormData({ ...formData, deferredVolume: Number(e.target.value) })
              }
            />
            <InputField
              label="Duration (hours)"
              type="number"
              required
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            />
            <InputField
              label="Estimated Loss (₦)"
              type="number"
              value={formData.estimatedLoss || ''}
              onChange={(e) =>
                setFormData({ ...formData, estimatedLoss: Number(e.target.value) })
              }
            />
            <InputField
              label="Reported By"
              required
              value={formData.reportedBy || ''}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
            />
          </div>
          <TextAreaField
            label="Reason / Description"
            required
            value={formData.reason || ''}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Report Deferment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
