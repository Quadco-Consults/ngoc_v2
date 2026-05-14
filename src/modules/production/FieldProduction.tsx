import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import StatsCard from '../../components/shared/StatsCard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FieldProduction {
  id: string;
  fieldName: string;
  productionDate: string;
  gasProduction: number;
  condensateProduction: number;
  waterCut: number;
  wellCount: number;
  activeWells: number;
  averageWellhead: number;
  uptime: number;
  targetProduction: number;
  variance: number;
  status: 'On Target' | 'Below Target' | 'Above Target';
}

// Mock data
const mockProduction: FieldProduction[] = [
  {
    id: '1',
    fieldName: 'Obiafu-Obrikom',
    productionDate: '2024-01-21',
    gasProduction: 850,
    condensateProduction: 12500,
    waterCut: 8.5,
    wellCount: 48,
    activeWells: 45,
    averageWellhead: 320,
    uptime: 98.5,
    targetProduction: 850,
    variance: 0,
    status: 'On Target',
  },
  {
    id: '2',
    fieldName: 'Escravos',
    productionDate: '2024-01-21',
    gasProduction: 720,
    condensateProduction: 10800,
    waterCut: 12.3,
    wellCount: 38,
    activeWells: 36,
    averageWellhead: 285,
    uptime: 96.2,
    targetProduction: 750,
    variance: -30,
    status: 'Below Target',
  },
  {
    id: '3',
    fieldName: 'Utorogu',
    productionDate: '2024-01-21',
    gasProduction: 680,
    condensateProduction: 9500,
    waterCut: 10.1,
    wellCount: 32,
    activeWells: 31,
    averageWellhead: 295,
    uptime: 97.8,
    targetProduction: 650,
    variance: 30,
    status: 'Above Target',
  },
  {
    id: '4',
    fieldName: 'Sapele',
    productionDate: '2024-01-21',
    gasProduction: 420,
    condensateProduction: 6200,
    waterCut: 15.2,
    wellCount: 24,
    activeWells: 22,
    averageWellhead: 245,
    uptime: 94.5,
    targetProduction: 450,
    variance: -30,
    status: 'Below Target',
  },
  {
    id: '5',
    fieldName: 'Ughelli East',
    productionDate: '2024-01-21',
    gasProduction: 380,
    condensateProduction: 5800,
    waterCut: 18.5,
    wellCount: 20,
    activeWells: 19,
    averageWellhead: 220,
    uptime: 95.2,
    targetProduction: 400,
    variance: -20,
    status: 'Below Target',
  },
];

const weeklyTrend = [
  { day: 'Mon', production: 3020, target: 3100 },
  { day: 'Tue', production: 3050, target: 3100 },
  { day: 'Wed', production: 2980, target: 3100 },
  { day: 'Thu', production: 3030, target: 3100 },
  { day: 'Fri', production: 3060, target: 3100 },
  { day: 'Sat', production: 3040, target: 3100 },
  { day: 'Sun', production: 3050, target: 3100 },
];

const fieldComparison = mockProduction.map((f) => ({
  name: f.fieldName.split(' ')[0],
  actual: f.gasProduction,
  target: f.targetProduction,
}));

export default function FieldProduction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const filteredData = mockProduction.filter((record) =>
    record.fieldName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalProduction = mockProduction.reduce((sum, p) => sum + p.gasProduction, 0);
  const totalTarget = mockProduction.reduce((sum, p) => sum + p.targetProduction, 0);
  const totalCondensate = mockProduction.reduce((sum, p) => sum + p.condensateProduction, 0);
  const avgUptime = (mockProduction.reduce((sum, p) => sum + p.uptime, 0) / mockProduction.length).toFixed(1);
  const achievementRate = ((totalProduction / totalTarget) * 100).toFixed(1);

  const columns = [
    {
      header: 'Field Name',
      accessor: 'fieldName' as keyof FieldProduction,
      render: (value: string, row: FieldProduction) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">
            {row.activeWells}/{row.wellCount} wells active
          </p>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'productionDate' as keyof FieldProduction,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Gas Production',
      accessor: 'gasProduction' as keyof FieldProduction,
      render: (value: number, row: FieldProduction) => (
        <div>
          <p className="font-medium">{value.toFixed(0)} MMSCF/D</p>
          <p className="text-xs text-gray-500">Target: {row.targetProduction} MMSCF/D</p>
        </div>
      ),
    },
    {
      header: 'Condensate',
      accessor: 'condensateProduction' as keyof FieldProduction,
      render: (value: number) => `${value.toLocaleString()} BBL/D`,
    },
    {
      header: 'Water Cut',
      accessor: 'waterCut' as keyof FieldProduction,
      render: (value: number) => (
        <span className={value > 15 ? 'text-red-600 font-medium' : 'text-gray-900'}>
          {value.toFixed(1)}%
        </span>
      ),
    },
    {
      header: 'Avg Wellhead (PSI)',
      accessor: 'averageWellhead' as keyof FieldProduction,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Uptime',
      accessor: 'uptime' as keyof FieldProduction,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                value >= 95 ? 'bg-green-500' : value >= 90 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs">{value.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      header: 'Variance',
      accessor: 'variance' as keyof FieldProduction,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          {value > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : value < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-600" />
          ) : (
            <Activity className="w-4 h-4 text-gray-400" />
          )}
          <span className={value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}>
            {value > 0 ? '+' : ''}
            {value.toFixed(0)}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof FieldProduction,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'On Target'
              ? 'bg-green-100 text-green-700'
              : value === 'Above Target'
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
        title="Field Production"
        subtitle="Individual gas field production monitoring and tracking"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
            <Button variant="primary">Real-time View</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Production"
          value={`${totalProduction.toFixed(0)} MMSCF/D`}
          color="primary"
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="Target Achievement"
          value={`${achievementRate}%`}
          color={parseFloat(achievementRate) >= 95 ? 'success' : 'warning'}
        />
        <StatsCard
          title="Total Condensate"
          value={`${totalCondensate.toLocaleString()} BBL/D`}
          color="secondary"
        />
        <StatsCard
          title="Average Uptime"
          value={`${avgUptime}%`}
          color="accent"
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Production Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="production"
                stroke="#00AD51"
                strokeWidth={2}
                name="Actual (MMSCF/D)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#00246B"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target (MMSCF/D)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Field Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Production Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fieldComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#00AD51" name="Actual (MMSCF/D)" />
              <Bar dataKey="target" fill="#00246B" name="Target (MMSCF/D)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
          {
            label: 'View Details',
            onClick: (row) => console.log('View', row),
            variant: 'primary',
          },
          {
            label: 'Production History',
            onClick: (row) => console.log('History', row),
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
    </div>
  );
}
