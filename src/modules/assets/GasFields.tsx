import { useState, useEffect } from 'react';
import { Download, Upload, Map as MapIcon, Table as TableIcon } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import PipelineNetworkMap from '../network/PipelineNetworkMap';
import type { GasField } from '../../types/gas-assets';
import { gasFieldsData } from '../../data/gas-fields';

export default function GasFields() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [fields, setFields] = useState<GasField[]>([]);

  useEffect(() => {
    setFields(gasFieldsData);
  }, []);

  const itemsPerPage = 10;
  const filteredData = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.oml.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (field: GasField) => {
    console.log('View field:', field);
  };

  const handleExport = () => {
    const headers = [
      'Field Name',
      'OML',
      'Operator',
      'Status',
      'Production (MMSCF/D)',
      'Capacity (MMSCF/D)',
      'Wells',
      'Proven Reserves (BCF)',
      'Latitude',
      'Longitude',
    ];

    const csvData = fields.map((field) => [
      field.name,
      field.oml,
      field.operator,
      field.status,
      field.currentProduction,
      field.capacity,
      field.wells,
      field.reserves.proven,
      field.location.lat,
      field.location.lng,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-fields-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Field Name',
      accessor: 'name' as keyof GasField,
    },
    {
      header: 'OML',
      accessor: 'oml' as keyof GasField,
    },
    {
      header: 'Operator',
      accessor: 'operator' as keyof GasField,
    },
    {
      header: 'Production (MMSCF/D)',
      accessor: 'currentProduction' as keyof GasField,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Capacity (MMSCF/D)',
      accessor: 'capacity' as keyof GasField,
      render: (value: number) => value.toFixed(0),
    },
    {
      header: 'Wells',
      accessor: 'wells' as keyof GasField,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof GasField,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'producing'
              ? 'bg-green-100 text-green-700'
              : value === 'development'
              ? 'bg-blue-100 text-blue-700'
              : value === 'exploration'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
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
        title="Gas Fields"
        subtitle="Gas fields that produce gas - view production data and field information"
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
          <p className="text-sm text-gray-600">Total Fields</p>
          <p className="text-2xl font-bold text-gray-900">{fields.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Producing</p>
          <p className="text-2xl font-bold text-green-600">
            {fields.filter((f) => f.status === 'producing').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Capacity</p>
          <p className="text-2xl font-bold text-blue-600">
            {fields.reduce((sum, f) => sum + f.capacity, 0).toFixed(0)} MMSCF/D
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Production</p>
          <p className="text-2xl font-bold text-orange-600">
            {fields.reduce((sum, f) => sum + f.currentProduction, 0).toFixed(0)} MMSCF/D
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by field name, OML, or operator..."
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
