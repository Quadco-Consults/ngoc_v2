import { Flame, TrendingUp, Gauge, Factory } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import StatsCard from '../../components/shared/StatsCard';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for gas dashboard
const productionTrend = [
  { time: '00:00', production: 1680, target: 1700 },
  { time: '04:00', production: 1690, target: 1700 },
  { time: '08:00', production: 1710, target: 1700 },
  { time: '12:00', production: 1720, target: 1700 },
  { time: '16:00', production: 1715, target: 1700 },
  { time: '20:00', production: 1705, target: 1700 },
  { time: '24:00', production: 1720, target: 1700 },
];

const fieldContribution = [
  { field: 'Obiafu-Obrikom', production: 850, capacity: 950 },
  { field: 'Escravos', production: 720, capacity: 800 },
  { field: 'Utorogu', production: 680, capacity: 750 },
  { field: 'Sapele', production: 420, capacity: 480 },
  { field: 'Others', production: 380, capacity: 450 },
];

const sectorDemand = [
  { name: 'Power', value: 42, volume: 720, color: '#00AD51' },
  { name: 'Industrial', value: 28, volume: 480, color: '#00246B' },
  { name: 'Export', value: 22, volume: 377, color: '#0D5EBA' },
  { name: 'Domestic', value: 8, volume: 137, color: '#F59E0B' },
];

const plantUtilization = [
  { plant: 'Escravos', utilization: 92, feedGas: 800 },
  { plant: 'Utorogu', utilization: 90, feedGas: 720 },
  { plant: 'Obite', utilization: 88, feedGas: 650 },
  { plant: 'Soku', utilization: 85, feedGas: 580 },
  { plant: 'Obiafu', utilization: 90, feedGas: 520 },
];

const weeklyProduction = [
  { day: 'Mon', gas: 1700, lpg: 4850, condensate: 12200 },
  { day: 'Tue', gas: 1710, lpg: 4920, condensate: 12350 },
  { day: 'Wed', gas: 1690, lpg: 4780, condensate: 12100 },
  { day: 'Thu', gas: 1720, lpg: 4860, condensate: 12280 },
  { day: 'Fri', gas: 1730, lpg: 4960, condensate: 12450 },
  { day: 'Sat', gas: 1715, lpg: 4900, condensate: 12340 },
  { day: 'Sun', gas: 1720, lpg: 4940, condensate: 12400 },
];

const topCustomers = [
  { name: 'Egbin Power', volume: 180, value: '₦7.2B' },
  { name: 'NLNG Limited', volume: 200, value: '₦8.5B' },
  { name: 'Dangote Industries', volume: 120, value: '₦5.1B' },
  { name: 'Azura-Edo IPP', volume: 78, value: '₦3.2B' },
  { name: 'Lagos Gas Co.', volume: 45, value: '₦1.8B' },
];

export default function GasDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gas Dashboard"
        subtitle="Comprehensive gas production, processing, and distribution overview"
        actions={
          <>
            <Button variant="outline">Refresh Data</Button>
            <Button variant="primary">Export Report</Button>
          </>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Gas Production"
          value="1,720 MMSCF/D"
          icon={<Flame className="w-6 h-6" />}
          color="primary"
          trend={{ value: 3.5, isPositive: true }}
        />
        <StatsCard
          title="Plant Throughput"
          value="3,270 MMSCF/D"
          icon={<Factory className="w-6 h-6" />}
          color="secondary"
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="Network Utilization"
          value="88.5%"
          icon={<Gauge className="w-6 h-6" />}
          color="accent"
        />
        <StatsCard
          title="Daily Revenue"
          value="₦56.2M"
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
          trend={{ value: 5.2, isPositive: true }}
        />
      </div>

      {/* Real-time Production */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Production Trend</h3>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data
          </span>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={productionTrend}>
            <defs>
              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00AD51" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00AD51" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00246B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00246B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="production"
              stroke="#00AD51"
              fillOpacity={1}
              fill="url(#colorProduction)"
              name="Actual Production (MMSCF/D)"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#00246B"
              fillOpacity={1}
              fill="url(#colorTarget)"
              strokeDasharray="5 5"
              name="Target (MMSCF/D)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Field Contribution & Sector Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Contribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Production Contribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fieldContribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="field" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="production" fill="#00AD51" name="Production (MMSCF/D)" />
              <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity (MMSCF/D)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Demand */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Demand by Sector</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorDemand}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorDemand.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {sectorDemand.map((sector) => (
              <div key={sector.name} className="border border-gray-200 rounded p-3">
                <p className="text-xs text-gray-600">{sector.name}</p>
                <p className="text-lg font-semibold text-gray-900">{sector.volume} MMSCF/D</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plant Utilization & Weekly Production */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plant Utilization */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Plant Utilization</h3>
          <div className="space-y-4">
            {plantUtilization.map((plant) => (
              <div key={plant.plant}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{plant.plant}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{plant.utilization}%</span>
                    <p className="text-xs text-gray-500">{plant.feedGas} MMSCF/D</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      plant.utilization >= 90
                        ? 'bg-green-500'
                        : plant.utilization >= 85
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${plant.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Production */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Production Summary</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyProduction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="gas"
                stroke="#00AD51"
                strokeWidth={2}
                name="Gas (MMSCF/D)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Gas Customers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Volume (MMSCF/D)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Monthly Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCustomers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.volume}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${85 + idx * 3}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{85 + idx * 3}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <h4 className="text-sm font-medium text-green-900 mb-2">Daily LPG Production</h4>
          <p className="text-3xl font-bold text-green-700 mb-1">4,960 MT</p>
          <p className="text-xs text-green-600">+3.2% from yesterday</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Condensate Production</h4>
          <p className="text-3xl font-bold text-blue-700 mb-1">12,400 BBL</p>
          <p className="text-xs text-blue-600">Within target range</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Flare Volume</h4>
          <p className="text-3xl font-bold text-purple-700 mb-1">32 MMSCF/D</p>
          <p className="text-xs text-purple-600">28.9% reduction YoY</p>
        </div>
      </div>
    </div>
  );
}
