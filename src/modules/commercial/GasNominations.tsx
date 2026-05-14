import { useState } from 'react';
import { Plus, Download, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';

interface GasNomination {
  id: string;
  nominationDate: string;
  gasDay: string;
  supplier: string;
  customer: string;
  nominatedVolume: number;
  confirmedVolume: number;
  actualDelivered: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  deliveryPoint: string;
  remarks?: string;
}

// Mock data
const mockNominations: GasNomination[] = [
  {
    id: '1',
    nominationDate: '2024-01-21',
    gasDay: '2024-01-22',
    supplier: 'Shell Petroleum',
    customer: 'Nigerian Gas Company',
    nominatedVolume: 150,
    confirmedVolume: 145,
    actualDelivered: 143,
    status: 'Delivered',
    priority: 'High',
    deliveryPoint: 'Escravos Hub',
  },
  {
    id: '2',
    nominationDate: '2024-01-21',
    gasDay: '2024-01-22',
    supplier: 'Chevron Nigeria',
    customer: 'Power Holding Company',
    nominatedVolume: 200,
    confirmedVolume: 200,
    actualDelivered: 0,
    status: 'Confirmed',
    priority: 'High',
    deliveryPoint: 'Bonny Terminal',
  },
  {
    id: '3',
    nominationDate: '2024-01-21',
    gasDay: '2024-01-22',
    supplier: 'Nigerian Petroleum',
    customer: 'Industrial Gas Ltd',
    nominatedVolume: 80,
    confirmedVolume: 0,
    actualDelivered: 0,
    status: 'Pending',
    priority: 'Medium',
    deliveryPoint: 'Utorogu Station',
  },
];

export default function GasNominations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GasNomination>>({});

  const itemsPerPage = 10;
  const filteredData = mockNominations.filter(
    (record) =>
      record.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalNominated = mockNominations.reduce((sum, r) => sum + r.nominatedVolume, 0);
  const totalConfirmed = mockNominations.reduce((sum, r) => sum + r.confirmedVolume, 0);
  const pendingCount = mockNominations.filter((r) => r.status === 'Pending').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit nomination:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Gas Day',
      accessor: 'gasDay' as keyof GasNomination,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Supplier',
      accessor: 'supplier' as keyof GasNomination,
      render: (value: string, row: GasNomination) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">→ {row.customer}</p>
        </div>
      ),
    },
    {
      header: 'Delivery Point',
      accessor: 'deliveryPoint' as keyof GasNomination,
    },
    {
      header: 'Nominated (MMSCF)',
      accessor: 'nominatedVolume' as keyof GasNomination,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Confirmed (MMSCF)',
      accessor: 'confirmedVolume' as keyof GasNomination,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Priority',
      accessor: 'priority' as keyof GasNomination,
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
      accessor: 'status' as keyof GasNomination,
      render: (value: string) => {
        const config = {
          Pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          Confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
          Delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          Rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        };
        const { icon: Icon, color, bg } = config[value as keyof typeof config];
        return (
          <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${bg}`}>
            <Icon className={`w-3 h-3 ${color}`} />
            <span className={color}>{value}</span>
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gas Nominations"
        subtitle="Daily gas nomination management and tracking"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              New Nomination
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Nominated"
          value={totalNominated.toFixed(0)}
          subtitle="MMSCF/D"
          color="primary"
        />
        <StatsCard
          title="Total Confirmed"
          value={totalConfirmed.toFixed(0)}
          subtitle="MMSCF/D"
          color="success"
        />
        <StatsCard
          title="Pending Nominations"
          value={pendingCount}
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatsCard
          title="Confirmation Rate"
          value={`${((totalConfirmed / totalNominated) * 100).toFixed(1)}%`}
          color="accent"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by supplier or customer..."
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
          {
            label: 'Confirm',
            onClick: (row) => console.log('Confirm', row),
            variant: 'outline',
          },
          {
            label: 'Reject',
            onClick: (row) => console.log('Reject', row),
            variant: 'danger',
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
        title="Create Gas Nomination"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Gas Day"
              type="date"
              required
              value={formData.gasDay || ''}
              onChange={(e) => setFormData({ ...formData, gasDay: e.target.value })}
            />
            <SelectField
              label="Priority"
              required
              value={formData.priority || ''}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as GasNomination['priority'] })}
              options={[
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' },
              ]}
            />
            <InputField
              label="Supplier"
              required
              value={formData.supplier || ''}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
            <InputField
              label="Customer"
              required
              value={formData.customer || ''}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />
            <InputField
              label="Delivery Point"
              required
              value={formData.deliveryPoint || ''}
              onChange={(e) => setFormData({ ...formData, deliveryPoint: e.target.value })}
            />
            <InputField
              label="Nominated Volume (MMSCF)"
              type="number"
              required
              value={formData.nominatedVolume || ''}
              onChange={(e) =>
                setFormData({ ...formData, nominatedVolume: Number(e.target.value) })
              }
            />
          </div>
          <TextAreaField
            label="Remarks"
            value={formData.remarks || ''}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Nomination
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
