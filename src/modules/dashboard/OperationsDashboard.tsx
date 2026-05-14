import { Wrench, AlertTriangle, Clock, CheckCircle, TrendingDown } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import StatsCard from '../../components/shared/StatsCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for operations dashboard
const maintenanceStats = [
  { status: 'Scheduled', count: 12, color: '#0D5EBA' },
  { status: 'In Progress', count: 8, color: '#F59E0B' },
  { status: 'Completed', count: 45, color: '#00AD51' },
  { status: 'Overdue', count: 3, color: '#EF4444' },
];

const incidentTrend = [
  { month: 'Aug', safety: 2, operational: 5, environmental: 1 },
  { month: 'Sep', safety: 1, operational: 4, environmental: 2 },
  { month: 'Oct', safety: 3, operational: 6, environmental: 1 },
  { month: 'Nov', safety: 1, operational: 3, environmental: 0 },
  { month: 'Dec', safety: 2, operational: 4, environmental: 1 },
  { month: 'Jan', safety: 1, operational: 2, environmental: 0 },
];

const defermentsByType = [
  { type: 'Planned', volume: 450, color: '#0D5EBA' },
  { type: 'Unplanned', volume: 320, color: '#F59E0B' },
  { type: 'Force Majeure', volume: 280, color: '#EF4444' },
];

const uptimeData = [
  { facility: 'Obiafu Field', uptime: 98.5 },
  { facility: 'Escravos Plant', uptime: 96.2 },
  { facility: 'Utorogu Station', uptime: 97.8 },
  { facility: 'Bonny LNG', uptime: 99.1 },
  { facility: 'AKK Pipeline', uptime: 94.5 },
];

const recentIncidents = [
  {
    id: '1',
    title: 'Minor gas leak at Compression Station',
    severity: 'Minor',
    date: '2024-01-20',
    status: 'Under Investigation',
  },
  {
    id: '2',
    title: 'Power failure at Utorogu Plant',
    severity: 'Minor',
    date: '2024-01-19',
    status: 'Resolved',
  },
  {
    id: '3',
    title: 'Equipment malfunction - Compressor 3',
    severity: 'Major',
    date: '2024-01-18',
    status: 'In Progress',
  },
];

const activeDeferments = [
  {
    id: '1',
    facility: 'Escravos Gas Plant - Train 2',
    reason: 'Scheduled maintenance shutdown',
    volume: 120,
    duration: '48 hrs',
  },
  {
    id: '2',
    facility: 'AKK Pipeline Section B',
    reason: 'Community interference',
    volume: 200,
    duration: '72 hrs',
  },
];

export default function OperationsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Dashboard"
        subtitle="Real-time operations monitoring and management"
        actions={
          <>
            <Button variant="outline">Refresh Data</Button>
            <Button variant="primary">Generate Report</Button>
          </>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Active Maintenance"
          value={8}
          icon={<Wrench className="w-6 h-6" />}
          color="warning"
        />
        <StatsCard
          title="Open Incidents"
          value={3}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="danger"
        />
        <StatsCard
          title="Avg Asset Uptime"
          value="97.2%"
          icon={<Clock className="w-6 h-6" />}
          color="success"
          trend={{ value: 1.2, isPositive: true }}
        />
        <StatsCard
          title="Completed Tasks"
          value={45}
          icon={<CheckCircle className="w-6 h-6" />}
          color="accent"
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Deferments</h3>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 text-xs rounded-full">
              {activeDeferments.length} Active
            </span>
          </div>
          <div className="space-y-3">
            {activeDeferments.map((def) => (
              <div key={def.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{def.facility}</p>
                    <p className="text-sm text-gray-600 mt-1">{def.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {def.volume} MMSCF/D
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {def.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Incidents</h3>
            <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">
              {recentIncidents.length} Recent
            </span>
          </div>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{incident.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          incident.severity === 'Critical'
                            ? 'bg-red-100 text-red-700'
                            : incident.severity === 'Major'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {incident.severity}
                      </span>
                      <span className="text-xs text-gray-500">{incident.date}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      incident.status === 'Resolved'
                        ? 'bg-green-100 text-green-700'
                        : incident.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={maintenanceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {maintenanceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incidentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="safety" stroke="#EF4444" strokeWidth={2} name="Safety" />
              <Line type="monotone" dataKey="operational" stroke="#F59E0B" strokeWidth={2} name="Operational" />
              <Line type="monotone" dataKey="environmental" stroke="#00AD51" strokeWidth={2} name="Environmental" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Uptime & Deferments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Uptime */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Uptime Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="facility" angle={-15} textAnchor="end" height={100} />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Bar dataKey="uptime" fill="#00AD51" name="Uptime %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deferments by Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deferments by Type (MMSCF/D)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={defermentsByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="type" type="category" />
              <Tooltip />
              <Bar dataKey="volume" name="Deferred Volume">
                {defermentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">MTBF (Mean Time Between Failures)</h4>
          <p className="text-3xl font-bold text-blue-700 mb-1">720 hours</p>
          <p className="text-xs text-blue-600">30-day average</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <h4 className="text-sm font-medium text-green-900 mb-2">MTTR (Mean Time To Repair)</h4>
          <p className="text-3xl font-bold text-green-700 mb-1">4.2 hours</p>
          <p className="text-xs text-green-600">Below 6-hour target</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Safety Record (Days)</h4>
          <p className="text-3xl font-bold text-purple-700 mb-1">156 days</p>
          <p className="text-xs text-purple-600">Since last LTI</p>
        </div>
      </div>
    </div>
  );
}
