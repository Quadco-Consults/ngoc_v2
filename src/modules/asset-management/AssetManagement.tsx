import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid3x3, List, Building2 } from 'lucide-react';
import type { RootState } from '../../store';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import AssetCard from './components/AssetCard';
import useDebounce from '../../hooks/useDebounce';

type ViewMode = 'grid' | 'list';
type AssetType = 'all' | 'gasPlant' | 'aggStation' | 'pipeline';

interface Asset {
  id: string;
  name: string;
  type: 'Gas Plant' | 'AGG Station' | 'Pipeline';
  operator: string;
  status: 'operational' | 'maintenance' | 'offline';
  location?: { lat: number; lng: number };
  capacity?: number;
  installedCapacity?: number;
  designCapacity?: number;
  utilization?: number;
}

export default function AssetManagement() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOperator, setFilterOperator] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState<AssetType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { gasPlants, aggStations, gasPipelines } = useSelector(
    (state: RootState) => state.gasAssets
  );

  // Combine all assets into a single array
  const allAssets: Asset[] = useMemo(() => {
    const plants = gasPlants.map((plant) => ({
      id: plant.id,
      name: plant.name,
      type: 'Gas Plant' as const,
      operator: plant.operator,
      status: plant.status,
      location: plant.location,
      capacity: plant.installedCapacity,
      installedCapacity: plant.installedCapacity,
    }));

    const stations = aggStations.map((station) => ({
      id: station.id,
      name: station.name,
      type: 'AGG Station' as const,
      operator: station.operator,
      status: station.status,
      location: station.location,
      designCapacity: station.designCapacity,
      utilization: station.utilization,
    }));

    const pipelines = gasPipelines.map((pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      type: 'Pipeline' as const,
      operator: pipeline.operator,
      status: pipeline.status,
      capacity: pipeline.installedCapacity,
      installedCapacity: pipeline.installedCapacity,
    }));

    return [...plants, ...stations, ...pipelines];
  }, [gasPlants, aggStations, gasPipelines]);

  // Get unique operators
  const operators = useMemo(() => {
    const uniqueOperators = new Set(allAssets.map((asset) => asset.operator));
    return Array.from(uniqueOperators).sort();
  }, [allAssets]);

  // Filter and search assets
  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesSearch =
        debouncedSearch === '' ||
        asset.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        asset.operator.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesOperator =
        filterOperator === 'all' || asset.operator === filterOperator;

      const matchesStatus =
        filterStatus === 'all' || asset.status === filterStatus;

      const matchesType =
        filterType === 'all' ||
        (filterType === 'gasPlant' && asset.type === 'Gas Plant') ||
        (filterType === 'aggStation' && asset.type === 'AGG Station') ||
        (filterType === 'pipeline' && asset.type === 'Pipeline');

      return matchesSearch && matchesOperator && matchesStatus && matchesType;
    });
  }, [allAssets, debouncedSearch, filterOperator, filterStatus, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterOperator, filterStatus, filterType]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: allAssets.length,
      gasPlants: gasPlants.length,
      aggStations: aggStations.length,
      pipelines: gasPipelines.length,
      operational: allAssets.filter((a) => a.status === 'operational').length,
      maintenance: allAssets.filter((a) => a.status === 'maintenance').length,
      offline: allAssets.filter((a) => a.status === 'offline').length,
    };
  }, [allAssets, gasPlants, aggStations, gasPipelines]);

  const handleAssetClick = (asset: Asset) => {
    // Navigate to asset details
    if (asset.type === 'Gas Plant') {
      navigate(`/assets/gas-plants?id=${asset.id}`);
    } else if (asset.type === 'AGG Station') {
      navigate(`/assets/agg-stations?id=${asset.id}`);
    } else {
      navigate(`/assets/pipelines?id=${asset.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Management"
        subtitle="Comprehensive view of all gas infrastructure assets"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/network/pipeline-network')}>
              View on Map
            </Button>
          </>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Total Assets</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Gas Plants</p>
          <p className="text-2xl font-bold text-green-600">{stats.gasPlants}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">AGG Stations</p>
          <p className="text-2xl font-bold text-purple-600">{stats.aggStations}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Pipelines</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pipelines}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Operational</p>
          <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Maintenance</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Offline</p>
          <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets by name or operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Asset Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AssetType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Asset Types</option>
            <option value="gasPlant">Gas Plants</option>
            <option value="aggStation">AGG Stations</option>
            <option value="pipeline">Pipelines</option>
          </select>

          {/* Operator Filter */}
          <select
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Operators</option>
            {operators.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border ${
                viewMode === 'grid'
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border ${
                viewMode === 'list'
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filterType !== 'all' || filterOperator !== 'all' || filterStatus !== 'all' || debouncedSearch) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              Showing {filteredAssets.length} of {allAssets.length} assets
            </span>
            <button
              onClick={() => {
                setFilterType('all');
                setFilterOperator('all');
                setFilterStatus('all');
                setSearchQuery('');
              }}
              className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Assets Grid/List */}
      {paginatedAssets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query to find assets.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilterType('all');
                setFilterOperator('all');
                setFilterStatus('all');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {paginatedAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                viewMode={viewMode}
                onClick={() => handleAssetClick(asset)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of{' '}
                {filteredAssets.length} assets
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
