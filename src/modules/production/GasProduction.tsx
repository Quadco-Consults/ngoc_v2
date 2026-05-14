import { useState } from 'react';
import { Plus, Download, TrendingUp, TrendingDown } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField } from '../../components/shared/FormField';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GasProductionRecord {
  id: string;
  date: string;
  field: string;
  actualProduction: number;
  targetProduction: number;
  variance: number;
  uptime: number;
  status: 'On Target' | 'Below Target' | 'Above Target';
  operator: string;
}

// Mock data
const mockProduction: GasProductionRecord[] = [
  {
    id: '1',
    date: '2024-01-21',
    field: 'Obiafu-Obrikom',
    actualProduction: 850,
    targetProduction: 820,
    variance: 30,
    uptime: 98.5,
    status: 'Above Target',
    operator: 'Shell Petroleum',
  },
  {
    id: '2',
    date: '2024-01-21',
    field: 'Escravos',
    actualProduction: 695,
    targetProduction: 720,
    variance: -25,
    uptime: 96.2,
    status: 'Below Target',
    operator: 'Chevron Nigeria',
  },
  {
    id: '3',
    date: '2024-01-21',
    field: 'Utorogu',
    actualProduction: 655,
    targetProduction: 660,
    variance: -5,
    uptime: 99.1,
    status: 'On Target',
    operator: 'Nigerian Petroleum',
  },
];

const weeklyData = [
  { day: 'Mon', actual: 1580, target: 1600 },
  { day: 'Tue', actual: 1620, target: 1600 },
  { day: 'Wed', actual: 1550, target: 1600 },
  { day: 'Thu', actual: 1600, target: 1600 },
  { day: 'Fri', actual: 1640, target: 1600 },
  { day: 'Sat', actual: 1610, target: 1600 },
  { day: 'Sun', actual: 1590, target: 1600 },
];

export default function GasProduction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GasProductionRecord>>({});

  const itemsPerPage = 10;
  const filteredData = mockProduction.filter((record) =>
    record.field.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalActual = mockProduction.reduce((sum, r) => sum + r.actualProduction, 0);
  const totalTarget = mockProduction.reduce((sum, r) => sum + r.targetProduction, 0);
  const avgUptime = mockProduction.reduce((sum, r) => sum + r.uptime, 0) / mockProduction.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit production:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as keyof GasProductionRecord,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Gas Field',
      accessor: 'field' as keyof GasProductionRecord,
      render: (value: string, row: GasProductionRecord) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.operator}</p>
        </div>
      ),
    },
    {
      header: 'Actual (MMSCF/D)',
      accessor: 'actualProduction' as keyof GasProductionRecord,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Target (MMSCF/D)',
      accessor: 'targetProduction' as keyof GasProductionRecord,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Variance',
      accessor: 'variance' as keyof GasProductionRecord,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          {value > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
            {value > 0 ? '+' : ''}
            {value.toFixed(0)}
          </span>
        </div>
      ),
    },
    {
      header: 'Uptime (%)',
      accessor: 'uptime' as keyof GasProductionRecord,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasProductionRecord,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Above Target'
              ? 'bg-green-100 text-green-700'
              : value === 'Below Target'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
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
        title="Gas Production"
        subtitle="Daily gas production tracking and monitoring"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
              Add Production
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Production"
          value={totalActual.toFixed(0)}
          subtitle="MMSCF/D"
          color="primary"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Target Production"
          value={totalTarget.toFixed(0)}
          subtitle="MMSCF/D"
          color="secondary"
        />
        <StatsCard
          title="Average Uptime"
          value={`${avgUptime.toFixed(1)}%`}
          color="success"
        />
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Production Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" fill="#00AD51" name="Actual" />
            <Bar dataKey="target" fill="#00246B" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by field name..."
        />
      </div>

      {/* Table */}
      <TableComponent
        data={paginatedData}
        columns={columns}
        actions={[
          { label: 'View Details', onClick: (row) => console.log('View', row), variant: 'primary' },
          { label: 'Edit', onClick: (row) => console.log('Edit', row), variant: 'outline' },
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
        title="Add Production Record"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Date"
            type="date"
            required
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <SelectField
            label="Gas Field"
            required
            value={formData.field || ''}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            options={[
              { value: 'Obiafu-Obrikom', label: 'Obiafu-Obrikom' },
              { value: 'Escravos', label: 'Escravos' },
              { value: 'Utorogu', label: 'Utorogu' },
            ]}
          />
          <InputField
            label="Actual Production (MMSCF/D)"
            type="number"
            required
            value={formData.actualProduction || ''}
            onChange={(e) => setFormData({ ...formData, actualProduction: Number(e.target.value) })}
          />
          <InputField
            label="Target Production (MMSCF/D)"
            type="number"
            required
            value={formData.targetProduction || ''}
            onChange={(e) => setFormData({ ...formData, targetProduction: Number(e.target.value) })}
          />
          <InputField
            label="Uptime (%)"
            type="number"
            step="0.1"
            required
            value={formData.uptime || ''}
            onChange={(e) => setFormData({ ...formData, uptime: Number(e.target.value) })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Production
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
