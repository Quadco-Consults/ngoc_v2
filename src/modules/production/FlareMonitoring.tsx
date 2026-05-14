import { useState } from 'react';
import { Flame, AlertTriangle, Download, TrendingDown } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import StatsCard from '../../components/shared/StatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FlareRecord {
  id: string;
  date: string;
  facility: string;
  flareVolume: number;
  flareIntensity: number;
  routineFlare: number;
  emergencyFlare: number;
  compliance: number;
  status: 'Compliant' | 'Warning' | 'Non-Compliant';
  operator: string;
}

// Mock data
const mockFlareData: FlareRecord[] = [
  {
    id: '1',
    date: '2024-01-21',
    facility: 'Escravos Gas Plant',
    flareVolume: 25.5,
    flareIntensity: 3.5,
    routineFlare: 20.0,
    emergencyFlare: 5.5,
    compliance: 92.5,
    status: 'Compliant',
    operator: 'Chevron Nigeria',
  },
  {
    id: '2',
    date: '2024-01-21',
    facility: 'Bonny LNG Terminal',
    flareVolume: 45.2,
    flareIntensity: 6.8,
    routineFlare: 38.0,
    emergencyFlare: 7.2,
    compliance: 78.3,
    status: 'Warning',
    operator: 'NLNG',
  },
  {
    id: '3',
    date: '2024-01-21',
    facility: 'Utorogu Plant',
    flareVolume: 18.3,
    flareIntensity: 2.1,
    routineFlare: 16.0,
    emergencyFlare: 2.3,
    compliance: 95.8,
    status: 'Compliant',
    operator: 'Nigerian Petroleum',
  },
];

const trendData = [
  { month: 'Jul', volume: 120, target: 100 },
  { month: 'Aug', volume: 110, target: 95 },
  { month: 'Sep', volume: 105, target: 90 },
  { month: 'Oct', volume: 98, target: 85 },
  { month: 'Nov', volume: 92, target: 80 },
  { month: 'Dec', volume: 89, target: 75 },
  { month: 'Jan', volume: 85, target: 70 },
];

export default function FlareMonitoring() {
  const [searchQuery, setSearchQuery] = useState('');

  const totalFlare = mockFlareData.reduce((sum, r) => sum + r.flareVolume, 0);
  const avgCompliance = mockFlareData.reduce((sum, r) => sum + r.compliance, 0) / mockFlareData.length;
  const nonCompliantCount = mockFlareData.filter(r => r.status === 'Non-Compliant').length;

  const filteredData = mockFlareData.filter((record) =>
    record.facility.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as keyof FlareRecord,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Facility',
      accessor: 'facility' as keyof FlareRecord,
      render: (value: string, row: FlareRecord) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.operator}</p>
        </div>
      ),
    },
    {
      header: 'Total Flare (MMSCF/D)',
      accessor: 'flareVolume' as keyof FlareRecord,
      render: (value: number) => value.toFixed(1),
    },
    {
      header: 'Routine Flare',
      accessor: 'routineFlare' as keyof FlareRecord,
      render: (value: number) => value.toFixed(1),
    },
    {
      header: 'Emergency Flare',
      accessor: 'emergencyFlare' as keyof FlareRecord,
      render: (value: number) => value.toFixed(1),
    },
    {
      header: 'Compliance (%)',
      accessor: 'compliance' as keyof FlareRecord,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                value >= 90 ? 'bg-green-600' : value >= 75 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium">{value.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof FlareRecord,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Compliant'
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
        title="Flare Monitoring"
        subtitle="Gas flaring tracking and compliance monitoring"
        actions={
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Flare Volume"
          value={totalFlare.toFixed(1)}
          subtitle="MMSCF/D"
          icon={<Flame className="w-6 h-6" />}
          color="warning"
          trend={{ value: 12.3, isPositive: true }}
        />
        <StatsCard
          title="Average Compliance"
          value={`${avgCompliance.toFixed(1)}%`}
          icon={<TrendingDown className="w-6 h-6" />}
          color="success"
        />
        <StatsCard
          title="Non-Compliant Facilities"
          value={nonCompliantCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="danger"
        />
        <StatsCard
          title="Routine vs Emergency"
          value="78% / 22%"
          color="accent"
        />
      </div>

      {/* Flare Reduction Trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Flare Reduction Trend (Last 7 Months)
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
              stroke="#F59E0B"
              strokeWidth={2}
              name="Actual Flare"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#00AD51"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by facility name..."
        />
      </div>

      {/* Table */}
      <TableComponent
        data={filteredData}
        columns={columns}
        actions={[
          { label: 'View Details', onClick: (row) => console.log('View', row), variant: 'primary' },
          { label: 'Report Issue', onClick: (row) => console.log('Report', row), variant: 'danger' },
        ]}
      />

      {/* Compliance Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">DPR Flare Compliance Notice</h4>
            <p className="text-sm text-yellow-800 mt-1">
              All facilities must maintain routine flare below 10 MMSCF/D and achieve 95% compliance by Q2 2024.
              Non-compliant facilities will face penalties as per DPR regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
