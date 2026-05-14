import { Flame, Factory, Workflow, AlertTriangle, Gauge } from 'lucide-react';
import StatsCard from '../components/shared/StatsCard';
import PageHeader from '../components/shared/PageHeader';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const productionData = [
  { month: 'Jan', production: 1200, target: 1500 },
  { month: 'Feb', production: 1350, target: 1500 },
  { month: 'Mar', production: 1450, target: 1500 },
  { month: 'Apr', production: 1380, target: 1500 },
  { month: 'May', production: 1550, target: 1500 },
  { month: 'Jun', production: 1620, target: 1500 },
];

const fieldDistribution = [
  { name: 'Onshore Fields', value: 45, color: '#00AD51' },
  { name: 'Offshore Fields', value: 35, color: '#00246B' },
  { name: 'Deep Water', value: 20, color: '#0D5EBA' },
];

const recentAlerts = [
  { id: 1, title: 'Well GW-023 Pressure Drop', severity: 'high', time: '2 hours ago' },
  { id: 2, title: 'Pipeline Section A Maintenance Due', severity: 'medium', time: '5 hours ago' },
  { id: 3, title: 'Plant B Production Target Missed', severity: 'low', time: '1 day ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Overview of gas operations across all assets"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Gas Production"
          value="1,620 MMSCF/D"
          icon={<Flame className="w-6 h-6" />}
          color="primary"
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatsCard
          title="Active Gas Fields"
          value="45"
          icon={<Gauge className="w-6 h-6" />}
          color="secondary"
          subtitle="Across 12 OMLs"
        />
        <StatsCard
          title="Gas Plants Operating"
          value="12"
          icon={<Factory className="w-6 h-6" />}
          color="accent"
          subtitle="98.5% uptime"
        />
        <StatsCard
          title="Pipeline Network"
          value="2,450 km"
          icon={<Workflow className="w-6 h-6" />}
          color="success"
          subtitle="Active transmission"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gas Production Trend (MMSCF/D)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="production"
                stroke="#00AD51"
                strokeWidth={2}
                name="Actual Production"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#00246B"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Field Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Production by Field Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fieldDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {fieldDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Recent Alerts
            </h3>
            <a href="#" className="text-sm text-[#00AD51] hover:underline">
              View All
            </a>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === 'high'
                        ? 'bg-red-500'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-700'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
