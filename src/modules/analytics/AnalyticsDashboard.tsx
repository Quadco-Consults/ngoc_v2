import { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import StatsCard from '../../components/shared/StatsCard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Mock data for analytics
const productionTrend = [
  { month: 'Jul', production: 1580, target: 1650, flare: 45 },
  { month: 'Aug', production: 1620, target: 1650, flare: 42 },
  { month: 'Sep', production: 1590, target: 1650, flare: 48 },
  { month: 'Oct', production: 1650, target: 1650, flare: 40 },
  { month: 'Nov', production: 1680, target: 1700, flare: 38 },
  { month: 'Dec', production: 1700, target: 1700, flare: 35 },
  { month: 'Jan', production: 1720, target: 1750, flare: 32 },
];

const assetPerformance = [
  { asset: 'Obiafu-Obrikom', production: 850, capacity: 950, utilization: 89 },
  { asset: 'Escravos', production: 720, capacity: 800, utilization: 90 },
  { asset: 'Utorogu', production: 680, capacity: 750, utilization: 91 },
  { asset: 'Bonny LNG', production: 21500, capacity: 22000, utilization: 98 },
  { asset: 'OK LNG', production: 5800, capacity: 6000, utilization: 97 },
];

const sectorAllocation = [
  { name: 'Power', value: 42, color: '#00AD51' },
  { name: 'Industrial', value: 28, color: '#00246B' },
  { name: 'Export (LNG)', value: 22, color: '#0D5EBA' },
  { name: 'Domestic', value: 8, color: '#F59E0B' },
];

const operationalMetrics = [
  { subject: 'Production', A: 95, fullMark: 100 },
  { subject: 'Safety', A: 88, fullMark: 100 },
  { subject: 'Maintenance', A: 92, fullMark: 100 },
  { subject: 'Compliance', A: 97, fullMark: 100 },
  { subject: 'Efficiency', A: 90, fullMark: 100 },
  { subject: 'Reliability', A: 93, fullMark: 100 },
];

const monthlyRevenue = [
  { month: 'Jul', revenue: 45.2, cost: 18.5, margin: 26.7 },
  { month: 'Aug', revenue: 48.1, cost: 19.2, margin: 28.9 },
  { month: 'Sep', revenue: 46.8, cost: 18.9, margin: 27.9 },
  { month: 'Oct', revenue: 50.2, cost: 19.8, margin: 30.4 },
  { month: 'Nov', revenue: 52.5, cost: 20.1, margin: 32.4 },
  { month: 'Dec', revenue: 54.8, cost: 20.5, margin: 34.3 },
  { month: 'Jan', revenue: 56.2, cost: 21.0, margin: 35.2 },
];

const defermentAnalysis = [
  { type: 'Planned', count: 12, volume: 450, loss: 18.2 },
  { type: 'Unplanned', count: 8, volume: 320, loss: 12.8 },
  { type: 'Force Majeure', count: 3, volume: 280, loss: 11.2 },
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const totalProduction = productionTrend[productionTrend.length - 1].production;
  const productionTarget = productionTrend[productionTrend.length - 1].target;
  const achievementRate = ((totalProduction / productionTarget) * 100).toFixed(1);
  const avgUtilization = (
    assetPerformance.reduce((sum, a) => sum + a.utilization, 0) / assetPerformance.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Comprehensive insights and performance analytics across all operations"
        actions={
          <>
            <Button variant="outline" icon={<Calendar className="w-4 h-4" />}>
              {timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </Button>
            <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
            <Button variant="primary" icon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </>
        }
      />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Production"
          value={`${totalProduction.toLocaleString()} MMSCF/D`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="primary"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Target Achievement"
          value={`${achievementRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="Average Utilization"
          value={`${avgUtilization}%`}
          color="accent"
          trend={{ value: 1.8, isPositive: true }}
        />
        <StatsCard
          title="Monthly Revenue"
          value="₦56.2B"
          color="secondary"
          trend={{ value: 7.1, isPositive: true }}
        />
      </div>

      {/* Production Trend Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Production Trend Analysis</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-xs rounded ${
                timeRange === '7d' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-xs rounded ${
                timeRange === '30d' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 text-xs rounded ${
                timeRange === '90d' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              90D
            </button>
          </div>
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
            <XAxis dataKey="month" />
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
              name="Target (MMSCF/D)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Asset Performance and Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assetPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="asset" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#00AD51" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Allocation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Allocation by Sector</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operational Metrics and Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Excellence Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={operationalMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance Score" dataKey="A" stroke="#00AD51" fill="#00AD51" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Margin Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#00AD51" strokeWidth={2} name="Revenue (₦B)" />
              <Line type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} name="Cost (₦B)" />
              <Line type="monotone" dataKey="margin" stroke="#00246B" strokeWidth={2} name="Margin (₦B)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deferment Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Deferment Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={defermentAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="#00246B" name="Count" />
            <Bar yAxisId="left" dataKey="volume" fill="#0D5EBA" name="Volume (MMSCF/D)" />
            <Bar yAxisId="right" dataKey="loss" fill="#EF4444" name="Financial Loss (₦B)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <h4 className="text-sm font-medium text-green-900 mb-2">Production Efficiency</h4>
          <p className="text-3xl font-bold text-green-700 mb-1">94.8%</p>
          <p className="text-xs text-green-600">Above industry benchmark of 90%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Flare Reduction</h4>
          <p className="text-3xl font-bold text-blue-700 mb-1">28.9%</p>
          <p className="text-xs text-blue-600">Year-over-year improvement</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Uptime Reliability</h4>
          <p className="text-3xl font-bold text-purple-700 mb-1">97.2%</p>
          <p className="text-xs text-purple-600">Exceeding 95% target</p>
        </div>
      </div>
    </div>
  );
}
