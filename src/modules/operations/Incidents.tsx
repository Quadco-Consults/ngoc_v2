import { useState } from 'react';
import { Plus, Download, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface Incident {
  id: string;
  incidentDate: string;
  facility: string;
  incidentType: 'Safety' | 'Operational' | 'Environmental' | 'Security';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  reportedBy: string;
  assignedTo: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  rootCause?: string;
  correctiveAction?: string;
  closureDate?: string;
}

// Mock data
const mockIncidents: Incident[] = [
  {
    id: '1',
    incidentDate: '2024-01-20',
    facility: 'Escravos Gas Plant',
    incidentType: 'Operational',
    severity: 'Major',
    description: 'Unexpected compressor shutdown due to vibration alarm',
    reportedBy: 'John Okafor',
    assignedTo: 'Engineering Team',
    status: 'Under Investigation',
  },
  {
    id: '2',
    incidentDate: '2024-01-18',
    facility: 'AKK Pipeline Section B',
    incidentType: 'Safety',
    severity: 'Minor',
    description: 'Minor gas leak detected during routine inspection',
    reportedBy: 'Sarah Ahmed',
    assignedTo: 'Safety Team',
    status: 'Resolved',
    rootCause: 'Worn seal on valve connection',
    correctiveAction: 'Seal replaced and valve recalibrated',
    closureDate: '2024-01-19',
  },
  {
    id: '3',
    incidentDate: '2024-01-17',
    facility: 'Bonny LNG Terminal',
    incidentType: 'Environmental',
    severity: 'Critical',
    description: 'Elevated flare volume exceeding DPR limits',
    reportedBy: 'Michael Nwosu',
    assignedTo: 'Operations Manager',
    status: 'Open',
  },
  {
    id: '4',
    incidentDate: '2024-01-15',
    facility: 'Utorogu Station',
    incidentType: 'Security',
    severity: 'Minor',
    description: 'Unauthorized access attempt at perimeter fence',
    reportedBy: 'Security Team',
    assignedTo: 'Security Manager',
    status: 'Closed',
    rootCause: 'Inadequate perimeter lighting',
    correctiveAction: 'Additional lighting installed and patrol frequency increased',
    closureDate: '2024-01-16',
  },
];

export default function Incidents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Incident>>({});

  const itemsPerPage = 10;
  const filteredData = mockIncidents.filter((record) =>
    record.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCount = mockIncidents.filter((r) => r.status === 'Open').length;
  const criticalCount = mockIncidents.filter((r) => r.severity === 'Critical').length;
  const resolvedCount = mockIncidents.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit incident:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'incidentDate' as keyof Incident,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Facility',
      accessor: 'facility' as keyof Incident,
      render: (value: string, row: Incident) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.incidentType} Incident</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description' as keyof Incident,
      render: (value: string) => (
        <p className="text-sm text-gray-700 truncate max-w-xs">{value}</p>
      ),
    },
    {
      header: 'Severity',
      accessor: 'severity' as keyof Incident,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            value === 'Critical'
              ? 'bg-red-100 text-red-700'
              : value === 'Major'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Reported By',
      accessor: 'reportedBy' as keyof Incident,
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo' as keyof Incident,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Incident,
      render: (value: string) => {
        const config = {
          'Open': { color: 'text-red-700', bg: 'bg-red-100' },
          'Under Investigation': { color: 'text-blue-700', bg: 'bg-blue-100' },
          'Resolved': { color: 'text-green-700', bg: 'bg-green-100' },
          'Closed': { color: 'text-gray-700', bg: 'bg-gray-100' },
        };
        const { color, bg } = config[value as keyof typeof config];
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${bg} ${color}`}>
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Management"
        subtitle="Track and manage safety, operational, and environmental incidents"
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
              Report Incident
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Open Incidents"
          value={openCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="danger"
        />
        <StatsCard
          title="Critical Severity"
          value={criticalCount}
          icon={<Activity className="w-6 h-6" />}
          color="warning"
        />
        <StatsCard
          title="Resolved/Closed"
          value={resolvedCount}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="success"
        />
        <StatsCard
          title="Avg Resolution Time"
          value="2.3 days"
          color="accent"
        />
      </div>

      {/* Critical Incidents Alert */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Critical Incidents Requiring Attention</h4>
              <p className="text-sm text-red-800 mt-1">
                {criticalCount} critical incident{criticalCount > 1 ? 's require' : ' requires'}{' '}
                immediate attention. These incidents may pose significant safety, environmental, or
                operational risks.
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
          placeholder="Search by facility or description..."
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
            label: 'Close Incident',
            onClick: (row) => console.log('Close', row),
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
        title="Report Incident"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Incident Date"
              type="date"
              required
              value={formData.incidentDate || ''}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
            />
            <InputField
              label="Facility"
              required
              value={formData.facility || ''}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
            />
            <SelectField
              label="Incident Type"
              required
              value={formData.incidentType || ''}
              onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
              options={[
                { value: 'Safety', label: 'Safety' },
                { value: 'Operational', label: 'Operational' },
                { value: 'Environmental', label: 'Environmental' },
                { value: 'Security', label: 'Security' },
              ]}
            />
            <SelectField
              label="Severity"
              required
              value={formData.severity || ''}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              options={[
                { value: 'Critical', label: 'Critical' },
                { value: 'Major', label: 'Major' },
                { value: 'Minor', label: 'Minor' },
              ]}
            />
            <InputField
              label="Reported By"
              required
              value={formData.reportedBy || ''}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
            />
            <InputField
              label="Assigned To"
              required
              value={formData.assignedTo || ''}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </div>
          <TextAreaField
            label="Incident Description"
            required
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Report Incident
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
