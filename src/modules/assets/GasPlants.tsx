import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Upload, Map as MapIcon, Table as TableIcon, Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import type { RootState } from '../../store';
import { setGasPlants } from '../../store/gasAssetsSlice';
import { gasPlantsData } from '../../data/gas-plants';
import type { GasPlant } from '../../types/gas-assets';

export default function GasPlants() {
  const dispatch = useDispatch();
  const gasPlants = useSelector((state: RootState) => state.gasAssets.gasPlants);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load initial data if not present
  useEffect(() => {
    if (gasPlants.length === 0) {
      dispatch(setGasPlants(gasPlantsData));
    }
  }, [dispatch, gasPlants.length]);

  const itemsPerPage = 10;

  // Get unique operators for filter
  const operators = ['all', ...new Set(gasPlants.map((plant) => plant.operator))];

  const filteredData = gasPlants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOperator = filterOperator === 'all' || plant.operator === filterOperator;
    const matchesStatus = filterStatus === 'all' || plant.status === filterStatus;

    return matchesSearch && matchesOperator && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (plant: GasPlant) => {
    console.log('View plant:', plant);
  };

  const handleExport = () => {
    const headers = [
      'Name',
      'Operator',
      'Type',
      'Status',
      'Installed Capacity (MMSCFD)',
      'Operating Capacity (MMSCFD)',
      'Gas Supply Fields',
      'Delivery Markets',
      'Commission Date',
      'Remark',
    ];

    const csvData = gasPlants.map((plant) => [
      plant.name,
      plant.operator,
      plant.type,
      plant.status,
      plant.installedCapacity,
      plant.operatingCapacity || '',
      plant.gasSupplyFields?.join('; ') || '',
      plant.deliveryMarkets?.join('; ') || '',
      plant.commissionDate || '',
      plant.remark || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-plants-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalInstalledCapacity = gasPlants.reduce((sum, p) => sum + p.installedCapacity, 0);
  const totalOperatingCapacity = gasPlants.reduce(
    (sum, p) => sum + (p.operatingCapacity || 0),
    0
  );
  const operationalCount = gasPlants.filter((p) => p.status === 'operational').length;
  const avgUtilization =
    gasPlants.filter((p) => p.operatingCapacity).length > 0
      ? (totalOperatingCapacity / totalInstalledCapacity) * 100
      : 0;

  const columns = [
    {
      header: 'Plant Name',
      accessor: 'name' as keyof GasPlant,
      render: (value: string, row: GasPlant) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 uppercase">{row.type}</p>
        </div>
      ),
    },
    {
      header: 'Operator',
      accessor: 'operator' as keyof GasPlant,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{value}</span>
      ),
    },
    {
      header: 'Installed Capacity (MMSCFD)',
      accessor: 'installedCapacity' as keyof GasPlant,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{value.toLocaleString()}</span>
      ),
    },
    {
      header: 'Operating Capacity (MMSCFD)',
      accessor: 'operatingCapacity' as keyof GasPlant,
      render: (value: number | undefined, row: GasPlant) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const utilizationPercent = (value / row.installedCapacity) * 100;
        return (
          <div>
            <p className="font-medium">{value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{utilizationPercent.toFixed(0)}% utilization</p>
          </div>
        );
      },
    },
    {
      header: 'Supply Fields',
      accessor: 'gasSupplyFields' as keyof GasPlant,
      render: (value: string[] | undefined) => {
        if (!value || value.length === 0) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((field, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                {field}
              </span>
            ))}
            {value.length > 2 && (
              <span className="text-xs text-gray-500">+{value.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Delivery Markets',
      accessor: 'deliveryMarkets' as keyof GasPlant,
      render: (value: string[] | undefined) => {
        if (!value || value.length === 0) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((market, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-xs rounded ${
                  market.includes('NLNG')
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {market}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasPlant,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'operational'
              ? 'bg-green-100 text-green-700'
              : value === 'maintenance'
              ? 'bg-yellow-100 text-yellow-700'
              : value === 'offline'
              ? 'bg-gray-100 text-gray-700'
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
        title="Gas Processing Plants"
        subtitle="Gas processing facilities, NAG/AG plants, CPFs, and FPSOs across Nigeria"
        actions={
          <>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              icon={<TableIcon className="w-4 h-4" />}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'map' ? 'primary' : 'outline'}
              icon={<MapIcon className="w-4 h-4" />}
              onClick={() => setViewMode('map')}
            >
              Map
            </Button>
            <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add Plant
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Plants</p>
          <p className="text-2xl font-bold text-gray-900">{gasPlants.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Operational</p>
          <p className="text-2xl font-bold text-green-600">{operationalCount}</p>
          <p className="text-xs text-gray-500">{((operationalCount / gasPlants.length) * 100).toFixed(0)}% of total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Installed Capacity</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalInstalledCapacity.toLocaleString()} MMSCFD
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Operating Capacity</p>
          <p className="text-2xl font-bold text-orange-600">
            {totalOperatingCapacity.toLocaleString()} MMSCFD
          </p>
          <p className="text-xs text-gray-500">{avgUtilization.toFixed(1)}% utilization</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search by name, operator, or type..."
            />
          </div>
          <div>
            <select
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {operators.map((op) => (
                <option key={op} value={op}>
                  {op === 'all' ? 'All Operators' : op}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <>
          <TableComponent
            data={paginatedData}
            columns={columns}
            onRowClick={handleView}
            actions={[{ label: 'View Details', onClick: handleView, variant: 'primary' }]}
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
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center h-96 text-gray-500">
            <p>Map view coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}
