import { Flame, Gauge, Factory, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import KPICard from '../../components/shared/KPICard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../lib/utils';

// Mock data - will be replaced with API calls
const mockMetrics = {
  totalProduction: 4500,
  domesticSupply: 3200,
  exportVolume: 1100,
  flareVolume: 200,
  activeFacilities: 142,
  totalFacilities: 150,
  dgoCompliance: 76.8,
  avgUtilization: 84.2,
};

const mockProductionTrend = [
  { date: '2024-01-15', production: 4200, demand: 3900 },
  { date: '2024-01-16', production: 4350, demand: 4000 },
  { date: '2024-01-17', production: 4280, demand: 3950 },
  { date: '2024-01-18', production: 4500, demand: 4100 },
  { date: '2024-01-19', production: 4420, demand: 4050 },
  { date: '2024-01-20', production: 4600, demand: 4200 },
  { date: '2024-01-21', production: 4500, demand: 4150 },
];

const mockAlerts = [
  {
    id: 1,
    facility: 'Escravos Gas Plant',
    type: 'maintenance',
    message: 'Scheduled maintenance in progress - Train 2',
    severity: 'warning',
    time: '2 hours ago',
  },
  {
    id: 2,
    facility: 'AKK Pipeline Section B',
    type: 'pressure',
    message: 'Pressure anomaly detected - 850 PSI',
    severity: 'critical',
    time: '4 hours ago',
  },
  {
    id: 3,
    facility: 'Bonny Island LNG Terminal',
    type: 'production',
    message: 'Train 4 operating at reduced capacity (80%)',
    severity: 'warning',
    time: '6 hours ago',
  },
];

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-gray-600 mt-1">National Gas Operations Command Center</p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        <KPICard
          title="Total Gas Production"
          value={formatNumber(mockMetrics.totalProduction, 0)}
          unit="MMSCF/D"
          icon={Flame}
          color="primary"
          trend={{ value: 5.2, isPositive: true }}
        />
        <KPICard
          title="Domestic Gas Supply"
          value={formatNumber(mockMetrics.domesticSupply, 0)}
          unit="MMSCF/D"
          icon={TrendingUp}
          color="success"
          trend={{ value: 3.8, isPositive: true }}
        />
        <KPICard
          title="Gas Export (LNG)"
          value={formatNumber(mockMetrics.exportVolume, 0)}
          unit="MMSCF/D"
          icon={Zap}
          color="secondary"
          trend={{ value: 2.1, isPositive: true }}
        />
        <KPICard
          title="Gas Flared"
          value={formatNumber(mockMetrics.flareVolume, 0)}
          unit="MMSCF/D"
          icon={AlertTriangle}
          color="warning"
          trend={{ value: -8.5, isPositive: true }}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Facilities</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockMetrics.activeFacilities} / {mockMetrics.totalFacilities}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Gauge className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">DGO Compliance</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockMetrics.dgoCompliance}%
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockMetrics.avgUtilization}%
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{mockAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Trend Chart */}
        <div className="lg:col-span-2 chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            National Gas Balance (7-Day Trend)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockProductionTrend}>
              <defs>
                <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00AD51" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00AD51" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D5EBA" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0D5EBA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value as string).toLocaleDateString()}
                formatter={(value) => [`${formatNumber(value as number, 0)} MMSCF/D`]}
              />
              <Area
                type="monotone"
                dataKey="production"
                stroke="#00AD51"
                fillOpacity={1}
                fill="url(#colorProduction)"
                name="Production"
              />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="#0D5EBA"
                fillOpacity={1}
                fill="url(#colorDemand)"
                name="Demand"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.facility}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Gas Supply by Sector</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Power Sector</span>
                <span className="text-sm font-medium">1,800 MMSCF/D (56%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Industrial</span>
                <span className="text-sm font-medium">980 MMSCF/D (31%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Domestic</span>
                <span className="text-sm font-medium">420 MMSCF/D (13%)</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Top Producing Fields</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Obiafu-Obrikom</span>
                <span className="text-sm font-medium">850 MMSCF/D</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Escravos</span>
                <span className="text-sm font-medium">720 MMSCF/D</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Utorogu</span>
                <span className="text-sm font-medium">680 MMSCF/D</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Pipeline Utilization</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Escravos-Lagos</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">AKK Pipeline</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">OB3 Pipeline</span>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
