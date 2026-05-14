import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Upload, Map as MapIcon, Table as TableIcon } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import AGGStationsMap from '../../components/maps/AGGStationsMap';
import type { RootState } from '../../store';
import { setAGGStations } from '../../store/gasAssetsSlice';
import { aggStationsData } from '../../data/agg-stations';
import type { AGGStation } from '../../types/gas-assets';

export default function AGGStations() {
  const dispatch = useDispatch();
  const aggStations = useSelector((state: RootState) => state.gasAssets.aggStations);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  // Load initial data if not present
  useEffect(() => {
    if (aggStations.length === 0) {
      dispatch(setAGGStations(aggStationsData));
    }
  }, [dispatch, aggStations.length]);

  const itemsPerPage = 10;
  const filteredData = aggStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.aggType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.processingType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (station: AGGStation) => {
    console.log('View station:', station);
  };

  const handleExport = () => {
    // Convert data to CSV format
    const headers = [
      'Name',
      'Status',
      'AGG Type',
      'Processing Type',
      'Design Capacity (MMSCFD)',
      'Available Capacity (MMSCFD)',
      'Utilization (%)',
      'Number of Trains',
      'Date Commissioned',
      'Latitude',
      'Longitude',
    ];

    const csvData = aggStations.map((station) => [
      station.name,
      station.status,
      station.aggType,
      station.processingType,
      station.designCapacity,
      station.availableCapacity,
      station.utilization,
      station.numberOfTrains,
      station.dateCommissioned || '',
      station.location.lat,
      station.location.lng,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agg-stations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Station Name',
      accessor: 'name' as keyof AGGStation,
      render: (value: string, row: AGGStation) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          {row.numberOfTrains > 0 && (
            <p className="text-xs text-gray-500">{row.numberOfTrains} trains</p>
          )}
        </div>
      ),
    },
    {
      header: 'AGG Type',
      accessor: 'aggType' as keyof AGGStation,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{value}</span>
      ),
    },
    {
      header: 'Processing',
      accessor: 'processingType' as keyof AGGStation,
      render: (value: string) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      header: 'Capacity (MMSCFD)',
      accessor: 'designCapacity' as keyof AGGStation,
      render: (value: number, row: AGGStation) => (
        <div>
          <p className="font-medium">{value}</p>
          {row.availableCapacity && (
            <p className="text-xs text-gray-500">Available: {row.availableCapacity}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Utilization',
      accessor: 'utilization' as keyof AGGStation,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
            <div
              className={`h-2 rounded-full ${
                value >= 80 ? 'bg-red-500' : value >= 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof AGGStation,
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
    {
      header: 'Commissioned',
      accessor: 'dateCommissioned' as keyof AGGStation,
      render: (value: string | undefined) => (
        <span className="text-sm text-gray-600">{value || 'N/A'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AGG Stations"
        subtitle="Associated Gas Gathering Stations - Manage and monitor gas processing facilities"
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
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Stations</p>
          <p className="text-2xl font-bold text-gray-900">{aggStations.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Operational</p>
          <p className="text-2xl font-bold text-green-600">
            {aggStations.filter((s) => s.status === 'operational').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Capacity</p>
          <p className="text-2xl font-bold text-blue-600">
            {aggStations.reduce((sum, s) => sum + s.designCapacity, 0).toFixed(0)} MMSCFD
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg Utilization</p>
          <p className="text-2xl font-bold text-orange-600">
            {(aggStations.reduce((sum, s) => sum + s.utilization, 0) / aggStations.length).toFixed(
              1
            )}
            %
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by name, AGG type, or processing type..."
        />
      </div>

      {/* Map or Table View */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <AGGStationsMap stations={filteredData} height="600px" />
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Showing {filteredData.filter((s) => s.location.lat !== 0).length} stations with valid
              coordinates out of {filteredData.length} total stations
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
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
      )}
    </div>
  );
}
