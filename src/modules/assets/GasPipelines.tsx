import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Upload, Map as MapIcon, Table as TableIcon, Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import type { RootState } from '../../store';
import { setGasPipelines } from '../../store/gasAssetsSlice';
import { gasPipelinesData } from '../../data/gas-pipelines';
import type { GasPipeline } from '../../types/gas-assets';

export default function GasPipelines() {
  const dispatch = useDispatch();
  const gasPipelines = useSelector((state: RootState) => state.gasAssets.gasPipelines);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Load initial data if not present
  useEffect(() => {
    if (gasPipelines.length === 0) {
      dispatch(setGasPipelines(gasPipelinesData));
    }
  }, [dispatch, gasPipelines.length]);

  const itemsPerPage = 10;

  // Get unique operators for filter
  const operators = ['all', ...new Set(gasPipelines.map((pipeline) => pipeline.operator))];

  const filteredData = gasPipelines.filter((pipeline) => {
    const matchesSearch =
      pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pipeline.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pipeline.size && pipeline.size.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesOperator = filterOperator === 'all' || pipeline.operator === filterOperator;
    const matchesType = filterType === 'all' || pipeline.type === filterType;

    return matchesSearch && matchesOperator && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (pipeline: GasPipeline) => {
    console.log('View pipeline:', pipeline);
  };

  const handleExport = () => {
    const headers = [
      'Name',
      'Operator',
      'Type',
      'Size',
      'Installed Capacity (MMSCFD)',
      'Operating Capacity (MMSCFD)',
      'Delivery Markets',
      'Status',
      'Remark',
    ];

    const csvData = gasPipelines.map((pipeline) => [
      pipeline.name,
      pipeline.operator,
      pipeline.type,
      pipeline.size || '',
      pipeline.installedCapacity,
      pipeline.operatingCapacity || '',
      pipeline.deliveryMarkets?.join('; ') || '',
      pipeline.status,
      pipeline.remark || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-pipelines-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalInstalledCapacity = gasPipelines.reduce((sum, p) => sum + p.installedCapacity, 0);
  const totalOperatingCapacity = gasPipelines.reduce(
    (sum, p) => sum + (p.operatingCapacity || 0),
    0
  );
  const operationalCount = gasPipelines.filter((p) => p.status === 'operational').length;
  const totalLength = gasPipelines.reduce((sum, p) => sum + (p.length || 0), 0);

  const columns = [
    {
      header: 'Pipeline Name',
      accessor: 'name' as keyof GasPipeline,
      render: (value: string, row: GasPipeline) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          {row.size && <p className="text-xs text-gray-500">{row.size}</p>}
        </div>
      ),
    },
    {
      header: 'Operator',
      accessor: 'operator' as keyof GasPipeline,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{value}</span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type' as keyof GasPipeline,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'transmission'
              ? 'bg-purple-100 text-purple-700'
              : value === 'gathering'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Installed Capacity (MMSCFD)',
      accessor: 'installedCapacity' as keyof GasPipeline,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{value.toLocaleString()}</span>
      ),
    },
    {
      header: 'Operating Capacity (MMSCFD)',
      accessor: 'operatingCapacity' as keyof GasPipeline,
      render: (value: number | undefined, row: GasPipeline) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const utilizationPercent = (value / row.installedCapacity) * 100;
        return (
          <div>
            <p className="font-medium">{value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{utilizationPercent.toFixed(0)}% flow</p>
          </div>
        );
      },
    },
    {
      header: 'Delivery Markets',
      accessor: 'deliveryMarkets' as keyof GasPipeline,
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
      accessor: 'status' as keyof GasPipeline,
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
        title="Gas Transmission Pipelines"
        subtitle="Gas transmission and distribution pipeline network across Nigeria"
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
              Add Pipeline
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Pipelines</p>
          <p className="text-2xl font-bold text-gray-900">{gasPipelines.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Operational</p>
          <p className="text-2xl font-bold text-green-600">{operationalCount}</p>
          <p className="text-xs text-gray-500">
            {((operationalCount / gasPipelines.length) * 100).toFixed(0)}% of total
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Capacity</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalInstalledCapacity.toLocaleString()} MMSCFD
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Length</p>
          <p className="text-2xl font-bold text-orange-600">{totalLength.toLocaleString()} km</p>
          <p className="text-xs text-gray-500">
            Operating: {totalOperatingCapacity.toLocaleString()} MMSCFD
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search by name, operator, or size..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="transmission">Transmission</option>
              <option value="gathering">Gathering</option>
              <option value="distribution">Distribution</option>
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
