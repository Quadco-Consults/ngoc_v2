import { useState } from 'react';
import { Plus, Download, PieChart as PieChartIcon } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField } from '../../components/shared/FormField';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GasAllocation {
  id: string;
  allocationDate: string;
  gasDay: string;
  sector: 'Power' | 'Industrial' | 'Domestic' | 'Export';
  customer: string;
  allocatedVolume: number;
  actualDelivered: number;
  variance: number;
  contractReference: string;
  deliveryPoint: string;
  status: 'Active' | 'Completed' | 'Pending';
}

// Mock data
const mockAllocations: GasAllocation[] = [
  {
    id: '1',
    allocationDate: '2024-01-21',
    gasDay: '2024-01-22',
    sector: 'Power',
    customer: 'Egbin Power Station',
    allocatedVolume: 180,
    actualDelivered: 175,
    variance: -5,
    contractReference: 'NNPC-PWR-2024-001',
    deliveryPoint: 'Escravos Hub',
    status: 'Active',
  },
  {
    id: '2',
    allocationDate: '2024-01-21',
    gasDay: '2024-01-22',
    sector: 'Industrial',
    customer: 'Dangote Industries',
    allocatedVolume: 120,
    actualDelivered: 120,
    variance: 0,
    contractReference: 'NNPC-IND-2024-015',
    deliveryPoint: 'Bonny Terminal',
    status: 'Completed',
  },
  {
    id: '3',
    allocationDate: '2024-01-21',
    gasDay: '2024-01-22',
    sector: 'Domestic',
    customer: 'Lagos Gas Company',
    allocatedVolume: 45,
    actualDelivered: 42,
    variance: -3,
    contractReference: 'NNPC-DOM-2024-087',
    deliveryPoint: 'Utorogu Station',
    status: 'Active',
  },
  {
    id: '4',
    allocationDate: '2024-01-21',
    gasDay: '2024-01-22',
    sector: 'Export',
    customer: 'NLNG Limited',
    allocatedVolume: 200,
    actualDelivered: 0,
    variance: 0,
    contractReference: 'NNPC-EXP-2024-003',
    deliveryPoint: 'Bonny LNG',
    status: 'Pending',
  },
];

const sectorDistribution = [
  { name: 'Power', value: 180, color: '#00AD51' },
  { name: 'Industrial', value: 120, color: '#00246B' },
  { name: 'Domestic', value: 45, color: '#0D5EBA' },
  { name: 'Export', value: 200, color: '#F59E0B' },
];

const comparisonData = [
  { sector: 'Power', allocated: 180, delivered: 175 },
  { sector: 'Industrial', allocated: 120, delivered: 120 },
  { sector: 'Domestic', allocated: 45, delivered: 42 },
  { sector: 'Export', allocated: 200, delivered: 0 },
];

export default function GasAllocations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GasAllocation>>({});

  const itemsPerPage = 10;
  const filteredData = mockAllocations.filter(
    (record) =>
      record.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalAllocated = mockAllocations.reduce((sum, r) => sum + r.allocatedVolume, 0);
  const totalDelivered = mockAllocations.reduce((sum, r) => sum + r.actualDelivered, 0);
  const deliveryRate = ((totalDelivered / totalAllocated) * 100).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit allocation:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Gas Day',
      accessor: 'gasDay' as keyof GasAllocation,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Sector',
      accessor: 'sector' as keyof GasAllocation,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            value === 'Power'
              ? 'bg-green-100 text-green-700'
              : value === 'Industrial'
              ? 'bg-blue-100 text-blue-700'
              : value === 'Domestic'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer' as keyof GasAllocation,
      render: (value: string, row: GasAllocation) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.contractReference}</p>
        </div>
      ),
    },
    {
      header: 'Delivery Point',
      accessor: 'deliveryPoint' as keyof GasAllocation,
    },
    {
      header: 'Allocated (MMSCF)',
      accessor: 'allocatedVolume' as keyof GasAllocation,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Delivered (MMSCF)',
      accessor: 'actualDelivered' as keyof GasAllocation,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Variance',
      accessor: 'variance' as keyof GasAllocation,
      render: (value: number) => (
        <span className={value < 0 ? 'text-red-600' : value > 0 ? 'text-green-600' : 'text-gray-600'}>
          {value > 0 ? '+' : ''}
          {value.toFixed(0)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasAllocation,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Completed'
              ? 'bg-green-100 text-green-700'
              : value === 'Active'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'
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
        title="Gas Allocations"
        subtitle="Sector-wise gas allocation and delivery tracking"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              New Allocation
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Allocated"
          value={totalAllocated.toFixed(0)}
          subtitle="MMSCF/D"
          color="primary"
        />
        <StatsCard
          title="Total Delivered"
          value={totalDelivered.toFixed(0)}
          subtitle="MMSCF/D"
          color="success"
        />
        <StatsCard
          title="Delivery Rate"
          value={`${deliveryRate}%`}
          icon={<PieChartIcon className="w-6 h-6" />}
          color="accent"
        />
        <StatsCard
          title="Active Allocations"
          value={mockAllocations.filter((a) => a.status === 'Active').length}
          color="secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation by Sector</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocated vs Delivered */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Allocated vs Delivered (MMSCF)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" fill="#00AD51" name="Allocated" />
              <Bar dataKey="delivered" fill="#00246B" name="Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by customer or sector..."
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
        title="Create Gas Allocation"
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
              label="Sector"
              required
              value={formData.sector || ''}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value as GasAllocation['sector'] })}
              options={[
                { value: 'Power', label: 'Power Sector' },
                { value: 'Industrial', label: 'Industrial' },
                { value: 'Domestic', label: 'Domestic' },
                { value: 'Export', label: 'Export (LNG)' },
              ]}
            />
            <InputField
              label="Customer"
              required
              value={formData.customer || ''}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />
            <InputField
              label="Contract Reference"
              required
              value={formData.contractReference || ''}
              onChange={(e) => setFormData({ ...formData, contractReference: e.target.value })}
            />
            <InputField
              label="Delivery Point"
              required
              value={formData.deliveryPoint || ''}
              onChange={(e) => setFormData({ ...formData, deliveryPoint: e.target.value })}
            />
            <InputField
              label="Allocated Volume (MMSCF)"
              type="number"
              required
              value={formData.allocatedVolume || ''}
              onChange={(e) =>
                setFormData({ ...formData, allocatedVolume: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Allocation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
