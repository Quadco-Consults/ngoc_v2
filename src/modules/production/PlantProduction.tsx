import { useState } from 'react';
import { Download, Factory, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import StatsCard from '../../components/shared/StatsCard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PlantProduction {
  id: string;
  plantName: string;
  productionDate: string;
  feedGas: number;
  leanGas: number;
  lpg: number;
  condensate: number;
  sulfur?: number;
  plantEfficiency: number;
  uptime: number;
  trainStatus: string;
  status: 'Optimal' | 'Normal' | 'Suboptimal';
}

// Mock data
const mockPlantProduction: PlantProduction[] = [
  {
    id: '1',
    plantName: 'Escravos Gas Plant',
    productionDate: '2024-01-21',
    feedGas: 800,
    leanGas: 720,
    lpg: 1250,
    condensate: 3200,
    sulfur: 45,
    plantEfficiency: 92.5,
    uptime: 98.2,
    trainStatus: 'Train 1&2 Online',
    status: 'Optimal',
  },
  {
    id: '2',
    plantName: 'Utorogu Gas Plant',
    productionDate: '2024-01-21',
    feedGas: 720,
    leanGas: 650,
    lpg: 1100,
    condensate: 2850,
    plantEfficiency: 90.3,
    uptime: 96.5,
    trainStatus: 'All Trains Online',
    status: 'Optimal',
  },
  {
    id: '3',
    plantName: 'Obite Gas Plant',
    productionDate: '2024-01-21',
    feedGas: 650,
    leanGas: 585,
    lpg: 980,
    condensate: 2450,
    plantEfficiency: 88.5,
    uptime: 94.8,
    trainStatus: 'Train 1 Maintenance',
    status: 'Normal',
  },
  {
    id: '4',
    plantName: 'Soku Gas Plant',
    productionDate: '2024-01-21',
    feedGas: 580,
    leanGas: 510,
    lpg: 850,
    condensate: 2100,
    plantEfficiency: 85.2,
    uptime: 92.1,
    trainStatus: 'Partial Operation',
    status: 'Suboptimal',
  },
  {
    id: '5',
    plantName: 'Obiafu Gas Plant',
    productionDate: '2024-01-21',
    feedGas: 520,
    leanGas: 468,
    lpg: 780,
    condensate: 1950,
    plantEfficiency: 89.8,
    uptime: 95.5,
    trainStatus: 'All Trains Online',
    status: 'Normal',
  },
];

const weeklyTrend = [
  { day: 'Mon', feedGas: 3200, leanGas: 2880, lpg: 4850 },
  { day: 'Tue', feedGas: 3250, leanGas: 2920, lpg: 4920 },
  { day: 'Wed', feedGas: 3180, leanGas: 2850, lpg: 4780 },
  { day: 'Thu', feedGas: 3220, leanGas: 2900, lpg: 4860 },
  { day: 'Fri', feedGas: 3270, leanGas: 2940, lpg: 4960 },
  { day: 'Sat', feedGas: 3240, leanGas: 2910, lpg: 4900 },
  { day: 'Sun', feedGas: 3260, leanGas: 2930, lpg: 4940 },
];

const productDistribution = [
  { name: 'Lean Gas', value: 2933, color: '#00AD51' },
  { name: 'LPG', value: 4960, color: '#00246B' },
  { name: 'Condensate', value: 12550, color: '#0D5EBA' },
  { name: 'Sulfur', value: 45, color: '#F59E0B' },
];

export default function PlantProduction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const filteredData = mockPlantProduction.filter((record) =>
    record.plantName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFeedGas = mockPlantProduction.reduce((sum, p) => sum + p.feedGas, 0);
  const totalLeanGas = mockPlantProduction.reduce((sum, p) => sum + p.leanGas, 0);
  const totalLPG = mockPlantProduction.reduce((sum, p) => sum + p.lpg, 0);
  const avgEfficiency = (
    mockPlantProduction.reduce((sum, p) => sum + p.plantEfficiency, 0) / mockPlantProduction.length
  ).toFixed(1);
  const avgUptime = (
    mockPlantProduction.reduce((sum, p) => sum + p.uptime, 0) / mockPlantProduction.length
  ).toFixed(1);

  const columns = [
    {
      header: 'Plant Name',
      accessor: 'plantName' as keyof PlantProduction,
      render: (value: string, row: PlantProduction) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.trainStatus}</p>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'productionDate' as keyof PlantProduction,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Feed Gas (MMSCF/D)',
      accessor: 'feedGas' as keyof PlantProduction,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Lean Gas (MMSCF/D)',
      accessor: 'leanGas' as keyof PlantProduction,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'LPG (MT/D)',
      accessor: 'lpg' as keyof PlantProduction,
      render: (value: number) => value.toLocaleString(),
    },
    {
      header: 'Condensate (BBL/D)',
      accessor: 'condensate' as keyof PlantProduction,
      render: (value: number) => value.toLocaleString(),
    },
    {
      header: 'Efficiency',
      accessor: 'plantEfficiency' as keyof PlantProduction,
      render: (value: number) => (
        <span
          className={`font-medium ${
            value >= 90 ? 'text-green-600' : value >= 85 ? 'text-yellow-600' : 'text-red-600'
          }`}
        >
          {value.toFixed(1)}%
        </span>
      ),
    },
    {
      header: 'Uptime',
      accessor: 'uptime' as keyof PlantProduction,
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
      header: 'Status',
      accessor: 'status' as keyof PlantProduction,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Optimal'
              ? 'bg-green-100 text-green-700'
              : value === 'Normal'
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
        title="Plant Production"
        subtitle="Gas processing plant production monitoring and optimization"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
            <Button variant="primary">Real-time Monitor</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatsCard
          title="Total Feed Gas"
          value={`${totalFeedGas.toFixed(0)} MMSCF/D`}
          icon={<Factory className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="Lean Gas Output"
          value={`${totalLeanGas.toFixed(0)} MMSCF/D`}
          color="success"
        />
        <StatsCard
          title="LPG Production"
          value={`${totalLPG.toLocaleString()} MT/D`}
          color="secondary"
        />
        <StatsCard
          title="Avg Efficiency"
          value={`${avgEfficiency}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="accent"
          trend={{ value: 1.8, isPositive: true }}
        />
        <StatsCard
          title="Avg Uptime"
          value={`${avgUptime}%`}
          color="warning"
          trend={{ value: 0.5, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Production Trend */}
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
                dataKey="feedGas"
                stroke="#00AD51"
                strokeWidth={2}
                name="Feed Gas (MMSCF/D)"
              />
              <Line
                type="monotone"
                dataKey="leanGas"
                stroke="#00246B"
                strokeWidth={2}
                name="Lean Gas (MMSCF/D)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {productDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plant Comparison Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plant Efficiency Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockPlantProduction}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="plantName" angle={-15} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="plantEfficiency" fill="#00AD51" name="Efficiency %" />
            <Bar dataKey="uptime" fill="#00246B" name="Uptime %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by plant name..."
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
            label: 'Performance Report',
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
    </div>
  );
}
