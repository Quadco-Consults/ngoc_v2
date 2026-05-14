import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Factory, Workflow, Gauge, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import type { RootState } from '../../store';
import { setGasPlants, setGasPipelines, setAGGStations } from '../../store/gasAssetsSlice';
import { gasPlantsData } from '../../data/gas-plants';
import { gasPipelinesData } from '../../data/gas-pipelines';
import { aggStationsData } from '../../data/agg-stations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function GasInfrastructureDashboard() {
  const dispatch = useDispatch();
  const { gasPlants, gasPipelines, aggStations } = useSelector((state: RootState) => state.gasAssets);

  // Load data if not present
  useEffect(() => {
    if (gasPlants.length === 0) dispatch(setGasPlants(gasPlantsData));
    if (gasPipelines.length === 0) dispatch(setGasPipelines(gasPipelinesData));
    if (aggStations.length === 0) dispatch(setAGGStations(aggStationsData));
  }, [dispatch, gasPlants.length, gasPipelines.length, aggStations.length]);

  // Calculate overall statistics
  const totalPlantCapacity = gasPlants.reduce((sum, p) => sum + p.installedCapacity, 0);
  const totalPlantOperating = gasPlants.reduce((sum, p) => sum + (p.operatingCapacity || 0), 0);
  const totalPipelineCapacity = gasPipelines.reduce((sum, p) => sum + p.installedCapacity, 0);
  const totalAGGCapacity = aggStations.reduce((sum, s) => sum + s.designCapacity, 0);

  const operationalPlants = gasPlants.filter((p) => p.status === 'operational').length;
  const operationalPipelines = gasPipelines.filter((p) => p.status === 'operational').length;
  const operationalAGG = aggStations.filter((s) => s.status === 'operational').length;

  // Plant capacity by operator
  const capacityByOperator = gasPlants.reduce((acc, plant) => {
    const existing = acc.find((item) => item.operator === plant.operator);
    if (existing) {
      existing.installed += plant.installedCapacity;
      existing.operating += plant.operatingCapacity || 0;
    } else {
      acc.push({
        operator: plant.operator,
        installed: plant.installedCapacity,
        operating: plant.operatingCapacity || 0,
      });
    }
    return acc;
  }, [] as { operator: string; installed: number; operating: number }[]);

  // Sort by installed capacity
  capacityByOperator.sort((a, b) => b.installed - a.installed);

  // Status distribution
  const statusData = [
    { name: 'Plants Operational', value: operationalPlants, color: '#10b981' },
    { name: 'Plants Offline', value: gasPlants.length - operationalPlants, color: '#6b7280' },
    { name: 'Pipelines Operational', value: operationalPipelines, color: '#3b82f6' },
    { name: 'Pipelines Offline', value: gasPipelines.length - operationalPipelines, color: '#9ca3af' },
  ];

  // Delivery market distribution
  const deliveryMarkets = gasPlants.reduce((acc, plant) => {
    plant.deliveryMarkets?.forEach((market) => {
      const existing = acc.find((item) => item.name === market);
      if (existing) {
        existing.value += plant.installedCapacity;
      } else {
        acc.push({ name: market, value: plant.installedCapacity });
      }
    });
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gas Infrastructure Dashboard"
        subtitle="Comprehensive overview of gas processing plants, transmission pipelines, and AGG stations"
      />

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gas Plants */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Factory className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {gasPlants.length} Plants
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gas Processing Plants</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Installed Capacity</span>
              <span className="text-sm font-bold text-gray-900">
                {totalPlantCapacity.toLocaleString()} MMSCFD
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Operating Capacity</span>
              <span className="text-sm font-bold text-orange-600">
                {totalPlantOperating.toLocaleString()} MMSCFD
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilization</span>
              <span className="text-sm font-bold text-green-600">
                {((totalPlantOperating / totalPlantCapacity) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {operationalPlants} operational ({((operationalPlants / gasPlants.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* AGG Stations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Gauge className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {aggStations.length} Stations
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AGG Stations</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Design Capacity</span>
              <span className="text-sm font-bold text-gray-900">
                {totalAGGCapacity.toLocaleString()} MMSCFD
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Utilization</span>
              <span className="text-sm font-bold text-orange-600">
                {(aggStations.reduce((sum, s) => sum + s.utilization, 0) / aggStations.length).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Trains</span>
              <span className="text-sm font-bold text-blue-600">
                {aggStations.reduce((sum, s) => sum + s.numberOfTrains, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {operationalAGG} operational ({((operationalAGG / aggStations.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Pipelines */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Workflow className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {gasPipelines.length} Pipelines
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transmission Pipelines</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Capacity</span>
              <span className="text-sm font-bold text-gray-900">
                {totalPipelineCapacity.toLocaleString()} MMSCFD
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Length</span>
              <span className="text-sm font-bold text-blue-600">
                {gasPipelines.reduce((sum, p) => sum + (p.length || 0), 0).toLocaleString()} km
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transmission</span>
              <span className="text-sm font-bold text-purple-600">
                {gasPipelines.filter((p) => p.type === 'transmission').length} lines
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {operationalPipelines} operational ({((operationalPipelines / gasPipelines.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity by Operator */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Processing Capacity by Operator
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capacityByOperator.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="operator" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'MMSCFD', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="installed" fill="#3b82f6" name="Installed" />
              <Bar dataKey="operating" fill="#f59e0b" name="Operating" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Market Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Capacity by Delivery Market
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryMarkets}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${((entry.value / totalPlantCapacity) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deliveryMarkets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operator Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operator Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Operator</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Plants</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Installed Capacity (MMSCFD)
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Operating Capacity (MMSCFD)
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {capacityByOperator.map((item) => (
                <tr key={item.operator} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.operator}</td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {gasPlants.filter((p) => p.operator === item.operator).length}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {item.installed.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-orange-600">
                    {item.operating.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (item.operating / item.installed) * 100 >= 80
                          ? 'bg-red-100 text-red-700'
                          : (item.operating / item.installed) * 100 >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {((item.operating / item.installed) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {operationalPlants + operationalAGG + operationalPipelines}
              </p>
              <p className="text-sm text-gray-600">Operational Assets</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {(((operationalPlants + operationalAGG + operationalPipelines) / (gasPlants.length + aggStations.length + gasPipelines.length)) * 100).toFixed(1)}% of total infrastructure
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(totalPlantCapacity + totalAGGCapacity + totalPipelineCapacity).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Capacity (MMSCFD)</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Combined installed capacity across all assets</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {gasPlants.length + aggStations.length + gasPipelines.length - operationalPlants - operationalAGG - operationalPipelines}
              </p>
              <p className="text-sm text-gray-600">Non-Operational</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Assets requiring attention or maintenance</p>
        </div>
      </div>
    </div>
  );
}
