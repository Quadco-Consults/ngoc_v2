import { useState, useEffect } from 'react';
import { Download, Upload, Map as MapIcon, Table as TableIcon } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import PipelineNetworkMap from '../network/PipelineNetworkMap';
import type { GasWell } from '../../types/gas-assets';
import { gasWellsData } from '../../data/gas-wells';

export default function GasWells() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [wells, setWells] = useState<GasWell[]>([]);

  useEffect(() => {
    setWells(gasWellsData);
  }, []);

  const itemsPerPage = 10;
  const filteredData = wells.filter((well) =>
    well.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    well.fieldName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (well: GasWell) => {
    console.log('View well:', well);
  };

  const handleExport = () => {
    const headers = [
      'Well Name',
      'Field Name',
      'Type',
      'Status',
      'Production (MMSCF/D)',
      'Pressure (PSI)',
      'Temperature (°C)',
      'Depth (m)',
      'Latitude',
      'Longitude',
    ];

    const csvData = wells.map((well) => [
      well.name,
      well.fieldName,
      well.type,
      well.status,
      well.production,
      well.pressure,
      well.temperature,
      well.depth,
      well.location.lat,
      well.location.lng,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-wells-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Well Name',
      accessor: 'name' as keyof GasWell,
      render: (value: string, row: GasWell) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.fieldName}</p>
        </div>
      ),
    },
    {
      header: 'Field',
      accessor: 'fieldName' as keyof GasWell,
    },
    {
      header: 'Type',
      accessor: 'type' as keyof GasWell,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
          {value}
        </span>
      ),
    },
    {
      header: 'Production (MMSCF/D)',
      accessor: 'production' as keyof GasWell,
      render: (value: number) => value.toFixed(1),
    },
    {
      header: 'Pressure (PSI)',
      accessor: 'pressure' as keyof GasWell,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Temperature (°C)',
      accessor: 'temperature' as keyof GasWell,
      render: (value: number) => value.toFixed(1),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasWell,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'operational'
              ? 'bg-green-100 text-green-700'
              : value === 'maintenance'
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
        title="Gas Wells"
        subtitle="Gas wells that produce gas - monitor well performance and production data"
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
          <p className="text-sm text-gray-600">Total Wells</p>
          <p className="text-2xl font-bold text-gray-900">{wells.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Operational</p>
          <p className="text-2xl font-bold text-green-600">
            {wells.filter((w) => w.status === 'operational').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Production</p>
          <p className="text-2xl font-bold text-blue-600">
            {wells.reduce((sum, w) => sum + w.production, 0).toFixed(1)} MMSCF/D
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg Depth</p>
          <p className="text-2xl font-bold text-orange-600">
            {(wells.reduce((sum, w) => sum + w.depth, 0) / wells.length).toFixed(0)} m
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by well name or field..."
        />
      </div>

      {/* Map or Table View */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div style={{ height: '600px', width: '100%' }}>
            <PipelineNetworkMap />
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
