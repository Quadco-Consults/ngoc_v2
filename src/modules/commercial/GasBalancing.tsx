import { useState } from 'react';
import { Plus, Download, Scale, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField, TextAreaField } from '../../components/shared/FormField';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GasBalance {
  id: string;
  balanceDate: string;
  gasDay: string;
  totalSupply: number;
  totalDemand: number;
  imbalance: number;
  imbalanceType: 'Surplus' | 'Deficit' | 'Balanced';
  tolerance: number;
  penaltyCharge: number;
  balancingAction: string;
  actionTaken: boolean;
  status: 'Balanced' | 'Warning' | 'Critical';
  notes?: string;
}

// Mock data
const mockBalances: GasBalance[] = [
  {
    id: '1',
    balanceDate: '2024-01-21',
    gasDay: '2024-01-22',
    totalSupply: 1720,
    totalDemand: 1705,
    imbalance: 15,
    imbalanceType: 'Surplus',
    tolerance: 50,
    penaltyCharge: 0,
    balancingAction: 'Store excess in pipeline pack',
    actionTaken: true,
    status: 'Balanced',
    notes: 'Within acceptable tolerance',
  },
  {
    id: '2',
    balanceDate: '2024-01-20',
    gasDay: '2024-01-21',
    totalSupply: 1680,
    totalDemand: 1720,
    imbalance: -40,
    imbalanceType: 'Deficit',
    tolerance: 50,
    penaltyCharge: 0,
    balancingAction: 'Utilize pipeline pack / linepack',
    actionTaken: true,
    status: 'Balanced',
    notes: 'Managed through linepack withdrawal',
  },
  {
    id: '3',
    balanceDate: '2024-01-19',
    gasDay: '2024-01-20',
    totalSupply: 1650,
    totalDemand: 1720,
    imbalance: -70,
    imbalanceType: 'Deficit',
    tolerance: 50,
    penaltyCharge: 2800000,
    balancingAction: 'Emergency supplier contact',
    actionTaken: true,
    status: 'Warning',
    notes: 'Exceeded tolerance, penalty applied',
  },
  {
    id: '4',
    balanceDate: '2024-01-18',
    gasDay: '2024-01-19',
    totalSupply: 1700,
    totalDemand: 1695,
    imbalance: 5,
    imbalanceType: 'Surplus',
    tolerance: 50,
    penaltyCharge: 0,
    balancingAction: 'No action required',
    actionTaken: false,
    status: 'Balanced',
    notes: 'Minimal surplus',
  },
];

const dailyTrend = [
  { day: 'Mon', supply: 1700, demand: 1695, imbalance: 5 },
  { day: 'Tue', supply: 1650, demand: 1720, imbalance: -70 },
  { day: 'Wed', supply: 1680, demand: 1720, imbalance: -40 },
  { day: 'Thu', supply: 1720, demand: 1705, imbalance: 15 },
  { day: 'Fri', supply: 1710, demand: 1700, imbalance: 10 },
  { day: 'Sat', supply: 1690, demand: 1680, imbalance: 10 },
  { day: 'Sun', supply: 1705, demand: 1710, imbalance: -5 },
];

const monthlyImbalance = [
  { month: 'Aug', surplus: 450, deficit: 380 },
  { month: 'Sep', surplus: 420, deficit: 410 },
  { month: 'Oct', surplus: 480, deficit: 440 },
  { month: 'Nov', surplus: 460, deficit: 390 },
  { month: 'Dec', surplus: 490, deficit: 420 },
  { month: 'Jan', surplus: 510, deficit: 460 },
];

export default function GasBalancing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GasBalance>>({});

  const itemsPerPage = 10;
  const filteredData = mockBalances.filter((record) =>
    record.gasDay.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.balancingAction.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const avgImbalance = (
    mockBalances.reduce((sum, b) => sum + Math.abs(b.imbalance), 0) / mockBalances.length
  ).toFixed(1);
  const totalPenalties = mockBalances.reduce((sum, b) => sum + b.penaltyCharge, 0);
  const balancedCount = mockBalances.filter((b) => b.status === 'Balanced').length;
  const criticalCount = mockBalances.filter((b) => b.status === 'Critical').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit balance:', formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Gas Day',
      accessor: 'gasDay' as keyof GasBalance,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Supply (MMSCF)',
      accessor: 'totalSupply' as keyof GasBalance,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Demand (MMSCF)',
      accessor: 'totalDemand' as keyof GasBalance,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Imbalance',
      accessor: 'imbalance' as keyof GasBalance,
      render: (value: number, row: GasBalance) => (
        <div>
          <p
            className={`font-medium ${
              value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {value > 0 ? '+' : ''}
            {value.toFixed(0)} MMSCF
          </p>
          <p className="text-xs text-gray-500">{row.imbalanceType}</p>
        </div>
      ),
    },
    {
      header: 'Tolerance',
      accessor: 'tolerance' as keyof GasBalance,
      render: (value: number, row: GasBalance) => (
        <div>
          <p className="text-sm">±{value} MMSCF</p>
          {Math.abs(row.imbalance) > value && (
            <p className="text-xs text-red-600">Exceeded</p>
          )}
        </div>
      ),
    },
    {
      header: 'Penalty Charge',
      accessor: 'penaltyCharge' as keyof GasBalance,
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
          {value > 0 ? `₦${(value / 1000000).toFixed(1)}M` : '—'}
        </span>
      ),
    },
    {
      header: 'Balancing Action',
      accessor: 'balancingAction' as keyof GasBalance,
      render: (value: string, row: GasBalance) => (
        <div>
          <p className="text-sm text-gray-900 truncate max-w-xs">{value}</p>
          <p className="text-xs text-gray-500">
            {row.actionTaken ? 'Action Taken' : 'No Action'}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasBalance,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Balanced'
              ? 'bg-green-100 text-green-700'
              : value === 'Warning'
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
        title="Gas Balancing"
        subtitle="Daily gas supply and demand balancing management"
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
              Record Balance
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Avg Daily Imbalance"
          value={`${avgImbalance} MMSCF`}
          icon={<Scale className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="Balanced Days"
          value={`${balancedCount}/${mockBalances.length}`}
          color="success"
        />
        <StatsCard
          title="Total Penalties"
          value={`₦${(totalPenalties / 1000000).toFixed(1)}M`}
          color="danger"
        />
        <StatsCard
          title="Critical Imbalances"
          value={criticalCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="warning"
        />
      </div>

      {/* Alerts */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Critical Imbalance Alert</h4>
              <p className="text-sm text-red-800 mt-1">
                {criticalCount} gas day{criticalCount > 1 ? 's have' : ' has'} critical imbalance
                requiring immediate balancing actions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Supply vs Demand */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Supply vs Demand (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="supply"
                stroke="#00AD51"
                strokeWidth={2}
                name="Supply (MMSCF)"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#00246B"
                strokeWidth={2}
                name="Demand (MMSCF)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Imbalance Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Imbalance Trend (MMSCF)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyImbalance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="surplus" fill="#00AD51" name="Surplus" />
              <Bar dataKey="deficit" fill="#EF4444" name="Deficit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by gas day or action..."
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
            label: 'Balancing Report',
            onClick: (row) => console.log('Report', row),
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
        title="Record Gas Balance"
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
            <InputField
              label="Total Supply (MMSCF)"
              type="number"
              required
              value={formData.totalSupply || ''}
              onChange={(e) => setFormData({ ...formData, totalSupply: Number(e.target.value) })}
            />
            <InputField
              label="Total Demand (MMSCF)"
              type="number"
              required
              value={formData.totalDemand || ''}
              onChange={(e) => setFormData({ ...formData, totalDemand: Number(e.target.value) })}
            />
            <InputField
              label="Tolerance (±MMSCF)"
              type="number"
              required
              value={formData.tolerance || ''}
              onChange={(e) => setFormData({ ...formData, tolerance: Number(e.target.value) })}
            />
            <SelectField
              label="Imbalance Type"
              required
              value={formData.imbalanceType || ''}
              onChange={(e) => setFormData({ ...formData, imbalanceType: e.target.value })}
              options={[
                { value: 'Surplus', label: 'Surplus' },
                { value: 'Deficit', label: 'Deficit' },
                { value: 'Balanced', label: 'Balanced' },
              ]}
            />
            <InputField
              label="Penalty Charge (₦)"
              type="number"
              value={formData.penaltyCharge || ''}
              onChange={(e) => setFormData({ ...formData, penaltyCharge: Number(e.target.value) })}
            />
          </div>
          <TextAreaField
            label="Balancing Action"
            required
            value={formData.balancingAction || ''}
            onChange={(e) => setFormData({ ...formData, balancingAction: e.target.value })}
          />
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
              Record Balance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
